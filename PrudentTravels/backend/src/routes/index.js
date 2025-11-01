const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const destinationRoutes = require('./destination.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');
const reviewRoutes = require('./review.routes');
const supportRoutes = require('./support.routes');
const adminRoutes = require('./admin.routes');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrudentTravels API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/destinations', destinationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = router;
