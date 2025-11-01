const { Op } = require('sequelize');
const { Destination, DestinationImage, Review, User } = require('../models');
const { PAGINATION } = require('../config/constants');

// Get all destinations with filters
const getDestinations = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      minPrice,
      maxPrice,
      country,
      city,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      featured,
      active = true
    } = req.query;

    // Build where clause
    const where = {};

    if (active !== undefined) where.isActive = active === 'true';
    if (featured !== undefined) where.isFeatured = featured === 'true';
    if (country) where.country = country;
    if (city) where.city = city;
    
    if (category) {
      where.category = {
        [Op.contains]: Array.isArray(category) ? category : [category]
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { country: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Calculate offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get destinations
    const { count, rows: destinations } = await Destination.findAndCountAll({
      where,
      include: [
        {
          model: DestinationImage,
          as: 'images',
          where: { isMain: false },
          required: false
        },
        {
          model: Review,
          as: 'reviews',
          attributes: [],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        destinations,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching destinations',
      error: error.message
    });
  }
};

// Get single destination
const getDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findOne({
      where: { 
        [Op.or]: [
          { id },
          { slug: id }
        ]
      },
      include: [
        {
          model: DestinationImage,
          as: 'images',
          order: [['order', 'ASC']]
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ],
          where: { isPublished: true },
          required: false,
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Increment view count
    await destination.increment('viewCount');

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching destination',
      error: error.message
    });
  }
};

// Create destination (Admin only)
const createDestination = async (req, res) => {
  try {
    const destinationData = req.body;

    // Handle main image
    if (req.files && req.files.mainImage) {
      // In production, upload to Cloudinary
      // For now, store local path
      destinationData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    }

    // Create destination
    const destination = await Destination.create(destinationData);

    // Handle additional images
    if (req.files && req.files.images) {
      const imagePromises = req.files.images.map((file, index) => {
        return DestinationImage.create({
          destinationId: destination.id,
          url: `/uploads/${file.filename}`,
          caption: req.body.imageCaptions ? req.body.imageCaptions[index] : null,
          order: index
        });
      });
      await Promise.all(imagePromises);
    }

    // Fetch destination with images
    const destinationWithImages = await Destination.findByPk(destination.id, {
      include: [
        {
          model: DestinationImage,
          as: 'images'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destinationWithImages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating destination',
      error: error.message
    });
  }
};

// Update destination (Admin only)
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Handle main image update
    if (req.files && req.files.mainImage) {
      updates.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    }

    // Update destination
    await destination.update(updates);

    // Handle additional images
    if (req.files && req.files.images) {
      // Delete existing non-main images if replacing all
      if (req.body.replaceAllImages === 'true') {
        await DestinationImage.destroy({
          where: { destinationId: id, isMain: false }
        });
      }

      const imagePromises = req.files.images.map((file, index) => {
        return DestinationImage.create({
          destinationId: destination.id,
          url: `/uploads/${file.filename}`,
          caption: req.body.imageCaptions ? req.body.imageCaptions[index] : null,
          order: index
        });
      });
      await Promise.all(imagePromises);
    }

    // Fetch updated destination with images
    const updatedDestination = await Destination.findByPk(id, {
      include: [
        {
          model: DestinationImage,
          as: 'images'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: updatedDestination
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating destination',
      error: error.message
    });
  }
};

// Delete destination (Admin only)
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Soft delete by deactivating
    await destination.update({ isActive: false });

    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting destination',
      error: error.message
    });
  }
};

// Get featured destinations
const getFeaturedDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      where: {
        isFeatured: true,
        isActive: true
      },
      limit: 8,
      order: [['rating', 'DESC'], ['bookingCount', 'DESC']]
    });

    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured destinations',
      error: error.message
    });
  }
};

// Get popular destinations
const getPopularDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      where: { isActive: true },
      order: [['bookingCount', 'DESC'], ['rating', 'DESC']],
      limit: 12
    });

    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular destinations',
      error: error.message
    });
  }
};

// Get related destinations
const getRelatedDestinations = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const relatedDestinations = await Destination.findAll({
      where: {
        id: { [Op.ne]: id },
        isActive: true,
        [Op.or]: [
          { category: { [Op.overlap]: destination.category } },
          { country: destination.country },
          { 
            price: {
              [Op.between]: [
                destination.price * 0.7,
                destination.price * 1.3
              ]
            }
          }
        ]
      },
      limit: 6,
      order: [['rating', 'DESC']]
    });

    res.json({
      success: true,
      data: relatedDestinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching related destinations',
      error: error.message
    });
  }
};

module.exports = {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getFeaturedDestinations,
  getPopularDestinations,
  getRelatedDestinations
};