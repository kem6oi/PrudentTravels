const { Op } = require('sequelize');
const { Booking, User, Destination, Payment, Review } = require('../models');
const { sequelize } = require('../config/database');

class AnalyticsService {
  /**
   * Get booking statistics
   */
  async getBookingStats(startDate, endDate) {
    try {
      const whereClause = {};

      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const totalBookings = await Booking.count({ where: whereClause });

      const bookingsByStatus = await Booking.findAll({
        where: whereClause,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      const totalRevenue = await Booking.sum('totalAmount', {
        where: {
          ...whereClause,
          status: { [Op.in]: ['confirmed', 'completed'] }
        }
      });

      const averageBookingValue = await Booking.findOne({
        where: {
          ...whereClause,
          status: { [Op.in]: ['confirmed', 'completed'] }
        },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('totalAmount')), 'average']
        ]
      });

      return {
        totalBookings,
        bookingsByStatus: bookingsByStatus.map(b => b.toJSON()),
        totalRevenue: totalRevenue || 0,
        averageBookingValue: parseFloat(averageBookingValue?.dataValues?.average || 0)
      };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const totalUsers = await User.count();

      const usersByRole = await User.findAll({
        attributes: [
          'role',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
      });

      const activeUsers = await User.count({
        where: { isActive: true }
      });

      const verifiedUsers = await User.count({
        where: { emailVerified: true }
      });

      const newUsersThisMonth = await User.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      });

      return {
        totalUsers,
        usersByRole: usersByRole.map(u => u.toJSON()),
        activeUsers,
        verifiedUsers,
        newUsersThisMonth
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(period = 'month') {
    try {
      let dateFormat;
      let groupBy;

      switch (period) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          groupBy = sequelize.fn('DATE', sequelize.col('createdAt'));
          break;
        case 'week':
          dateFormat = '%Y-%U';
          groupBy = sequelize.fn('YEARWEEK', sequelize.col('createdAt'));
          break;
        case 'year':
          dateFormat = '%Y';
          groupBy = sequelize.fn('YEAR', sequelize.col('createdAt'));
          break;
        default: // month
          dateFormat = '%Y-%m';
          groupBy = sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m');
      }

      const revenue = await Booking.findAll({
        where: {
          status: { [Op.in]: ['confirmed', 'completed'] }
        },
        attributes: [
          [groupBy, 'period'],
          [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'bookings']
        ],
        group: ['period'],
        order: [[sequelize.literal('period'), 'ASC']]
      });

      return revenue.map(r => r.toJSON());
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(limit = 10) {
    try {
      const destinations = await Destination.findAll({
        attributes: [
          'id',
          'name',
          'city',
          'country',
          [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'bookingCount'],
          [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'averageRating']
        ],
        include: [
          {
            model: Booking,
            as: 'bookings',
            attributes: [],
            where: {
              status: { [Op.in]: ['confirmed', 'completed'] }
            }
          },
          {
            model: Review,
            as: 'reviews',
            attributes: []
          }
        ],
        group: ['Destination.id'],
        order: [[sequelize.literal('bookingCount'), 'DESC']],
        limit,
        subQuery: false
      });

      return destinations.map(d => d.toJSON());
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary() {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      // Current month stats
      const currentMonthBookings = await Booking.count({
        where: {
          createdAt: { [Op.gte]: startOfMonth }
        }
      });

      const currentMonthRevenue = await Booking.sum('totalAmount', {
        where: {
          createdAt: { [Op.gte]: startOfMonth },
          status: { [Op.in]: ['confirmed', 'completed'] }
        }
      });

      // Last month stats
      const lastMonthBookings = await Booking.count({
        where: {
          createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] }
        }
      });

      const lastMonthRevenue = await Booking.sum('totalAmount', {
        where: {
          createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] },
          status: { [Op.in]: ['confirmed', 'completed'] }
        }
      });

      // Calculate growth
      const bookingGrowth = lastMonthBookings > 0
        ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(2)
        : 0;

      const revenueGrowth = lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)
        : 0;

      // Other stats
      const totalUsers = await User.count();
      const totalDestinations = await Destination.count();
      const pendingBookings = await Booking.count({ where: { status: 'pending' } });

      return {
        currentMonth: {
          bookings: currentMonthBookings,
          revenue: currentMonthRevenue || 0
        },
        lastMonth: {
          bookings: lastMonthBookings,
          revenue: lastMonthRevenue || 0
        },
        growth: {
          bookings: parseFloat(bookingGrowth),
          revenue: parseFloat(revenueGrowth)
        },
        totals: {
          users: totalUsers,
          destinations: totalDestinations,
          pendingBookings
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  /**
   * Get booking trends
   */
  async getBookingTrends(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const bookings = await Booking.findAll({
        where: {
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
      });

      return bookings.map(b => b.toJSON());
    } catch (error) {
      console.error('Error fetching booking trends:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
