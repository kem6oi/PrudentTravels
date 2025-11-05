const bookingService = require('../services/booking.service');
const { successResponse, errorResponse, createdResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPagingData } = require('../utils/helpers');

/**
 * Create new booking
 */
const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);

    return createdResponse(res, booking, 'Booking created successfully');
  } catch (error) {
    console.error('Error creating booking:', error);
    return errorResponse(res, error.message || 'Error creating booking', 400);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin can view any booking, users can only view their own
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const booking = await bookingService.getBookingById(id, userId);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    return successResponse(res, booking, 'Booking fetched successfully');
  } catch (error) {
    console.error('Error fetching booking:', error);
    return errorResponse(res, 'Error fetching booking', 500);
  }
};

/**
 * Get user bookings
 */
const getUserBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const filters = {};

    if (status) filters.status = status;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const bookings = await bookingService.getUserBookings(req.user.id, filters);

    return successResponse(res, bookings, 'Bookings fetched successfully');
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return errorResponse(res, 'Error fetching bookings', 500);
  }
};

/**
 * Get all bookings (admin only)
 */
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, destinationId, startDate, endDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (userId) filters.userId = userId;
    if (destinationId) filters.destinationId = destinationId;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const result = await bookingService.getAllBookings(filters, { page: parseInt(page), limit: parseInt(limit) });

    return paginatedResponse(
      res,
      result.bookings,
      {
        totalItems: result.total,
        currentPage: result.page,
        totalPages: result.pages,
        hasNextPage: result.page < result.pages,
        hasPrevPage: result.page > 1,
        limit: parseInt(limit)
      },
      'Bookings fetched successfully'
    );
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return errorResponse(res, 'Error fetching bookings', 500);
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, 'Status is required', 400);
    }

    // Only admin can update booking status
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const booking = await bookingService.updateBookingStatus(id, status, userId);

    return successResponse(res, booking, 'Booking status updated successfully');
  } catch (error) {
    console.error('Error updating booking status:', error);
    return errorResponse(res, error.message || 'Error updating booking status', 400);
  }
};

/**
 * Cancel booking
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await bookingService.cancelBooking(id, req.user.id, reason);

    return successResponse(res, booking, 'Booking cancelled successfully');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return errorResponse(res, error.message || 'Error cancelling booking', 400);
  }
};

/**
 * Check availability
 */
const checkAvailability = async (req, res) => {
  try {
    const { destinationId, checkInDate, checkOutDate } = req.query;

    if (!destinationId || !checkInDate || !checkOutDate) {
      return errorResponse(res, 'Destination ID, check-in date, and check-out date are required', 400);
    }

    const availability = await bookingService.checkAvailability(destinationId, checkInDate, checkOutDate);

    return successResponse(res, availability, 'Availability checked successfully');
  } catch (error) {
    console.error('Error checking availability:', error);
    return errorResponse(res, error.message || 'Error checking availability', 400);
  }
};

/**
 * Submit payment for a booking
 */
const submitPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethodId, transactionCode } = req.body;
    const userId = req.user.id;

    // Get uploaded file if present
    const paymentProof = req.file ? `/uploads/temp/${req.file.filename}` : null;

    // Validate required fields
    if (!bookingId || !paymentMethodId || !transactionCode) {
      return errorResponse(res, 'Booking ID, payment method, and transaction code are required', 400);
    }

    const payment = await bookingService.submitPayment({
      bookingId,
      userId,
      paymentMethodId,
      transactionCode,
      paymentProof
    });

    return successResponse(res, payment, 'Payment submitted successfully. Awaiting verification.');
  } catch (error) {
    console.error('Error submitting payment:', error);
    return errorResponse(res, error.message || 'Error submitting payment', 400);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
  submitPayment
};
