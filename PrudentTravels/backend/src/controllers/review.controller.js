const { Review, Booking, Destination, User } = require('../models');
const { successResponse, errorResponse, createdResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPagingData } = require('../utils/helpers');

/**
 * Create a new review
 */
const createReview = async (req, res) => {
  try {
    const { destinationId, bookingId, rating, title, comment, pros, cons } = req.body;

    // Check if booking exists and belongs to user
    if (bookingId) {
      const booking = await Booking.findOne({
        where: { id: bookingId, userId: req.user.id }
      });

      if (!booking) {
        return errorResponse(res, 'Booking not found or does not belong to you', 404);
      }

      if (booking.status !== 'completed') {
        return errorResponse(res, 'You can only review completed bookings', 400);
      }

      // Check if user already reviewed this booking
      const existingReview = await Review.findOne({
        where: { bookingId, userId: req.user.id }
      });

      if (existingReview) {
        return errorResponse(res, 'You have already reviewed this booking', 400);
      }
    }

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      destinationId,
      bookingId,
      rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      isVerified: !!bookingId
    });

    return createdResponse(res, review, 'Review created successfully');
  } catch (error) {
    console.error('Error creating review:', error);
    return errorResponse(res, 'Error creating review', 500);
  }
};

/**
 * Get reviews for a destination
 */
const getDestinationReviews = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { page = 1, limit = 10, rating, verified } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    const whereClause = {
      destinationId,
      isPublished: true
    };

    if (rating) {
      whereClause.rating = parseInt(rating);
    }

    if (verified === 'true') {
      whereClause.isVerified = true;
    }

    const data = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const response = getPagingData(data, page, queryLimit);

    // Calculate average rating
    const avgRating = await Review.findOne({
      where: { destinationId, isPublished: true },
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('rating')), 'average']
      ]
    });

    return paginatedResponse(
      res,
      response.items,
      {
        totalItems: response.totalItems,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        limit: queryLimit,
        averageRating: parseFloat(avgRating?.dataValues?.average || 0).toFixed(1)
      },
      'Reviews fetched successfully'
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse(res, 'Error fetching reviews', 500);
  }
};

/**
 * Get user reviews
 */
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Destination,
          as: 'destination',
          attributes: ['id', 'name', 'city', 'country']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, reviews, 'User reviews fetched successfully');
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return errorResponse(res, 'Error fetching user reviews', 500);
  }
};

/**
 * Update review
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, pros, cons } = req.body;

    const review = await Review.findOne({
      where: { id, userId: req.user.id }
    });

    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    const updates = {};
    if (rating !== undefined) updates.rating = rating;
    if (title !== undefined) updates.title = title;
    if (comment !== undefined) updates.comment = comment;
    if (pros !== undefined) updates.pros = pros;
    if (cons !== undefined) updates.cons = cons;

    await review.update(updates);

    return successResponse(res, review, 'Review updated successfully');
  } catch (error) {
    console.error('Error updating review:', error);
    return errorResponse(res, 'Error updating review', 500);
  }
};

/**
 * Delete review
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: { id, userId: req.user.id }
    });

    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    await review.destroy();

    return successResponse(res, null, 'Review deleted successfully');
  } catch (error) {
    console.error('Error deleting review:', error);
    return errorResponse(res, 'Error deleting review', 500);
  }
};

/**
 * Mark review as helpful
 */
const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);

    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    await review.update({
      helpfulCount: review.helpfulCount + 1
    });

    return successResponse(res, review, 'Review marked as helpful');
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return errorResponse(res, 'Error marking review as helpful', 500);
  }
};

/**
 * Admin: Add response to review
 */
const addAdminResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return errorResponse(res, 'Response is required', 400);
    }

    const review = await Review.findByPk(id);

    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    await review.update({
      adminResponse: response,
      adminResponseAt: new Date()
    });

    return successResponse(res, review, 'Admin response added successfully');
  } catch (error) {
    console.error('Error adding admin response:', error);
    return errorResponse(res, 'Error adding admin response', 500);
  }
};

/**
 * Admin: Toggle review published status
 */
const toggleReviewPublished = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);

    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    await review.update({
      isPublished: !review.isPublished
    });

    return successResponse(res, review, `Review ${review.isPublished ? 'published' : 'unpublished'} successfully`);
  } catch (error) {
    console.error('Error toggling review status:', error);
    return errorResponse(res, 'Error toggling review status', 500);
  }
};

module.exports = {
  createReview,
  getDestinationReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  addAdminResponse,
  toggleReviewPublished
};
