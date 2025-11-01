const { User, Booking, Destination, Payment, Review, SupportTicket } = require('../models');
const { ROLES } = require('../config/constants');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPagingData } = require('../utils/helpers');

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    const whereClause = {};

    if (role) {
      whereClause.role = role;
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    const data = await User.findAndCountAll({
      where: whereClause,
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    const response = getPagingData(data, page, queryLimit);

    return paginatedResponse(res, response.items, {
      totalItems: response.totalItems,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      limit: queryLimit
    }, 'Users fetched successfully');
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse(res, 'Error fetching users', 500);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Booking, as: 'bookings', limit: 10, order: [['createdAt', 'DESC']] },
        { model: Review, as: 'reviews', limit: 10 },
        { model: SupportTicket, as: 'tickets', limit: 5 }
      ]
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'User fetched successfully');
  } catch (error) {
    console.error('Error fetching user:', error);
    return errorResponse(res, 'Error fetching user', 500);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Prevent updating password through this endpoint
    delete updates.password;

    await user.update(updates);

    return successResponse(res, user, 'User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    return errorResponse(res, 'Error updating user', 500);
  }
};

/**
 * Deactivate/Activate user
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    await user.update({ isActive: !user.isActive });

    return successResponse(res, user, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    console.error('Error toggling user status:', error);
    return errorResponse(res, 'Error updating user status', 500);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Check if user has active bookings
    const activeBookings = await Booking.count({
      where: {
        userId: id,
        status: { [require('sequelize').Op.in]: ['pending', 'confirmed'] }
      }
    });

    if (activeBookings > 0) {
      return errorResponse(res, 'Cannot delete user with active bookings', 400);
    }

    await user.destroy();

    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return errorResponse(res, 'Error deleting user', 500);
  }
};

/**
 * Get platform statistics
 */
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalBookings = await Booking.count();
    const totalDestinations = await Destination.count();
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'success' }
    });

    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const openTickets = await SupportTicket.count({ where: { status: 'open' } });

    const stats = {
      users: {
        total: totalUsers,
        active: await User.count({ where: { isActive: true } }),
        verified: await User.count({ where: { emailVerified: true } })
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: await Booking.count({ where: { status: 'confirmed' } }),
        completed: await Booking.count({ where: { status: 'completed' } })
      },
      destinations: {
        total: totalDestinations,
        active: await Destination.count({ where: { isActive: true } })
      },
      revenue: {
        total: totalRevenue || 0,
        thisMonth: await Payment.sum('amount', {
          where: {
            status: 'success',
            createdAt: {
              [require('sequelize').Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }) || 0
      },
      support: {
        openTickets,
        resolvedTickets: await SupportTicket.count({ where: { status: 'resolved' } })
      }
    };

    return successResponse(res, stats, 'Platform statistics fetched successfully');
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return errorResponse(res, 'Error fetching platform statistics', 500);
  }
};

/**
 * Manage user role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(ROLES).includes(role)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    await user.update({ role });

    return successResponse(res, user, 'User role updated successfully');
  } catch (error) {
    console.error('Error updating user role:', error);
    return errorResponse(res, 'Error updating user role', 500);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getPlatformStats,
  updateUserRole
};
