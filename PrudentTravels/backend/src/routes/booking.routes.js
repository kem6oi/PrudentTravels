const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin, isOwnerOrAdmin } = require('../middleware/role.middleware');
const { validateBooking } = require('../middleware/validation.middleware');

// Placeholder controllers - to be implemented
const bookingController = {
  createBooking: async (req, res) => {
    res.json({ success: true, message: 'Booking created' });
  },
  getBookings: async (req, res) => {
    res.json({ success: true, message: 'Bookings fetched' });
  },
  getBooking: async (req, res) => {
    res.json({ success: true, message: 'Booking fetched' });
  },
  updateBooking: async (req, res) => {
    res.json({ success: true, message: 'Booking updated' });
  },
  cancelBooking: async (req, res) => {
    res.json({ success: true, message: 'Booking cancelled' });
  },
  getUserBookings: async (req, res) => {
    res.json({ success: true, message: 'User bookings fetched' });
  }
};

// All routes require authentication
router.use(protect);

// User routes
router.post('/', validateBooking, bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);

// Admin routes
router.get('/', isAdmin, bookingController.getBookings);

// Shared routes (owner or admin)
router.get('/:id', isOwnerOrAdmin('Booking'), bookingController.getBooking);
router.put('/:id', isOwnerOrAdmin('Booking'), bookingController.updateBooking);
router.post('/:id/cancel', isOwnerOrAdmin('Booking'), bookingController.cancelBooking);

module.exports = router;