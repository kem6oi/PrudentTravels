const { User, Booking, Review, Destination } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { uploadImage } = require('../config/cloudinary');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Booking,
          as: 'bookings',
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'Profile fetched successfully');
  } catch (error) {
    console.error('Error fetching profile:', error);
    return errorResponse(res, 'Error fetching profile', 500);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, address, preferences } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (address) updates.address = address;
    if (preferences) {
      updates.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.update(updates);

    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    return errorResponse(res, 'Error updating profile', 500);
  }
};

/**
 * Upload avatar
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Upload to Cloudinary
    const result = await uploadImage(req.file, 'avatars');

    await user.update({ avatar: result.url });

    return successResponse(res, { avatar: result.url }, 'Avatar uploaded successfully');
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return errorResponse(res, 'Error uploading avatar', 500);
  }
};

/**
 * Get user bookings
 */
const getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const whereClause = { userId: req.user.id };

    if (status) {
      whereClause.status = status;
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: Destination,
          as: 'destination'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, bookings, 'Bookings fetched successfully');
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return errorResponse(res, 'Error fetching bookings', 500);
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

    return successResponse(res, reviews, 'Reviews fetched successfully');
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse(res, 'Error fetching reviews', 500);
  }
};

/**
 * Get user wishlist
 */
const getWishlist = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Destination,
          as: 'wishlist',
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user.wishlist, 'Wishlist fetched successfully');
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return errorResponse(res, 'Error fetching wishlist', 500);
  }
};

/**
 * Add to wishlist
 */
const addToWishlist = async (req, res) => {
  try {
    const { destinationId } = req.body;

    if (!destinationId) {
      return errorResponse(res, 'Destination ID is required', 400);
    }

    const destination = await Destination.findByPk(destinationId);

    if (!destination) {
      return errorResponse(res, 'Destination not found', 404);
    }

    const user = await User.findByPk(req.user.id);

    // Add to wishlist
    await user.addWishlist(destination);

    return successResponse(res, null, 'Destination added to wishlist');
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return errorResponse(res, 'Error adding to wishlist', 500);
  }
};

/**
 * Remove from wishlist
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const user = await User.findByPk(req.user.id);
    const destination = await Destination.findByPk(destinationId);

    if (!destination) {
      return errorResponse(res, 'Destination not found', 404);
    }

    // Remove from wishlist
    await user.removeWishlist(destination);

    return successResponse(res, null, 'Destination removed from wishlist');
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return errorResponse(res, 'Error removing from wishlist', 500);
  }
};

/**
 * Update user preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const { newsletter, notifications, currency, language } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const updatedPreferences = {
      ...user.preferences,
      ...(newsletter !== undefined && { newsletter }),
      ...(notifications !== undefined && { notifications }),
      ...(currency && { currency }),
      ...(language && { language })
    };

    await user.update({ preferences: updatedPreferences });

    return successResponse(res, user, 'Preferences updated successfully');
  } catch (error) {
    console.error('Error updating preferences:', error);
    return errorResponse(res, 'Error updating preferences', 500);
  }
};

/**
 * Delete user account
 */
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Check for active bookings
    const activeBookings = await Booking.count({
      where: {
        userId: req.user.id,
        status: { [require('sequelize').Op.in]: ['pending', 'confirmed'] }
      }
    });

    if (activeBookings > 0) {
      return errorResponse(res, 'Cannot delete account with active bookings', 400);
    }

    // Deactivate instead of delete (soft delete)
    await user.update({ isActive: false });

    return successResponse(res, null, 'Account deactivated successfully');
  } catch (error) {
    console.error('Error deleting account:', error);
    return errorResponse(res, 'Error deleting account', 500);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getUserBookings,
  getUserReviews,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updatePreferences,
  deleteAccount
};
