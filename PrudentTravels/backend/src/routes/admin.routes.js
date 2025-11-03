const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');
const analyticsController = require('../controllers/analytics.controller');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard and stats
router.get('/dashboard', adminController.getPlatformStats);
router.get('/stats', adminController.getPlatformStats);

// Analytics routes
router.get('/analytics/bookings', analyticsController.getBookingStats);
router.get('/analytics/users', analyticsController.getUserStats);
router.get('/analytics/revenue', analyticsController.getRevenueAnalytics);
router.get('/analytics/popular-destinations', analyticsController.getPopularDestinations);
router.get('/analytics/dashboard-summary', analyticsController.getDashboardSummary);
router.get('/analytics/booking-trends', analyticsController.getBookingTrends);
router.get('/analytics', analyticsController.getDashboardSummary);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.put('/users/:id/suspend', adminController.suspendUser);
router.put('/users/:id/unsuspend', adminController.unsuspendUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;