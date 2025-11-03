const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin, isOwnerOrAdmin } = require('../middleware/role.middleware');
const { validateBooking } = require('../middleware/validation.middleware');
const bookingController = require('../controllers/booking.controller');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', validateBooking, bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);

// Admin routes
router.get('/', isAdmin, bookingController.getAllBookings);

// Shared routes (owner or admin)
router.get('/:id', isOwnerOrAdmin('Booking'), bookingController.getBookingById);
router.put('/:id', isOwnerOrAdmin('Booking'), bookingController.updateBookingStatus);
router.post('/:id/cancel', isOwnerOrAdmin('Booking'), bookingController.cancelBooking);

module.exports = router;