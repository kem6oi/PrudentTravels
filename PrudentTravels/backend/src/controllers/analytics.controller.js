const analyticsService = require('../services/analytics.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get booking statistics
 */
const getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await analyticsService.getBookingStats(startDate, endDate);

    return successResponse(res, stats, 'Booking statistics fetched successfully');
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return errorResponse(res, 'Error fetching booking statistics', 500);
  }
};

/**
 * Get user statistics
 */
const getUserStats = async (req, res) => {
  try {
    const stats = await analyticsService.getUserStats();

    return successResponse(res, stats, 'User statistics fetched successfully');
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return errorResponse(res, 'Error fetching user statistics', 500);
  }
};

/**
 * Get revenue analytics
 */
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    if (!['day', 'week', 'month', 'year'].includes(period)) {
      return errorResponse(res, 'Invalid period. Use: day, week, month, or year', 400);
    }

    const analytics = await analyticsService.getRevenueAnalytics(period);

    return successResponse(res, analytics, 'Revenue analytics fetched successfully');
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return errorResponse(res, 'Error fetching revenue analytics', 500);
  }
};

/**
 * Get popular destinations
 */
const getPopularDestinations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const destinations = await analyticsService.getPopularDestinations(parseInt(limit));

    return successResponse(res, destinations, 'Popular destinations fetched successfully');
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    return errorResponse(res, 'Error fetching popular destinations', 500);
  }
};

/**
 * Get dashboard summary
 */
const getDashboardSummary = async (req, res) => {
  try {
    const summary = await analyticsService.getDashboardSummary();

    return successResponse(res, summary, 'Dashboard summary fetched successfully');
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return errorResponse(res, 'Error fetching dashboard summary', 500);
  }
};

/**
 * Get booking trends
 */
const getBookingTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const trends = await analyticsService.getBookingTrends(parseInt(days));

    return successResponse(res, trends, 'Booking trends fetched successfully');
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    return errorResponse(res, 'Error fetching booking trends', 500);
  }
};

module.exports = {
  getBookingStats,
  getUserStats,
  getRevenueAnalytics,
  getPopularDestinations,
  getDashboardSummary,
  getBookingTrends
};
