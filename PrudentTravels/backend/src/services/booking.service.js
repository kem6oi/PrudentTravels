const { Op } = require('sequelize');
const { Booking, Destination, User, Payment } = require('../models');
const { BOOKING_STATUS } = require('../config/constants');
const { calculateDays } = require('../utils/helpers');
const emailService = require('./email.service');
const paymentService = require('./payment.service');

class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(bookingData, userId) {
    try {
      // Check if destination exists and is available
      const destination = await Destination.findByPk(bookingData.destinationId);

      if (!destination) {
        throw new Error('Destination not found');
      }

      if (!destination.isActive) {
        throw new Error('Destination is not available for booking');
      }

      // Validate dates
      if (!bookingData.checkInDate || !bookingData.checkOutDate) {
        throw new Error('Check-in and check-out dates are required');
      }

      // Calculate number of nights (or days for day trips)
      const nights = calculateDays(bookingData.checkInDate, bookingData.checkOutDate) || 1;

      // Calculate pricing based on per-person price from destination
      const numberOfGuests = (bookingData.adults || 1) + (bookingData.children || 0);
      const pricePerPerson = Number(destination.price) || 0;
      const basePrice = pricePerPerson * numberOfGuests;
      const taxes = (basePrice * 0.1); // 10% tax
      let discount = 0;

      // Apply promo code if provided
      if (bookingData.promoCode) {
        // Logic to validate and apply promo code would go here
        // For now, just a placeholder
      }

      const totalAmount = basePrice + taxes - discount;

      // Create booking
      const booking = await Booking.create({
        userId,
        destinationId: bookingData.destinationId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        adults: bookingData.adults,
        children: bookingData.children || 0,
        infants: bookingData.infants || 0,
        basePrice,
        taxes,
        discount,
        totalAmount,
        currency: bookingData.currency || 'USD',
        specialRequests: bookingData.specialRequests,
        guestDetails: bookingData.guestDetails || {},
        status: BOOKING_STATUS.PENDING
      });

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId, userId = null) {
    try {
      const whereClause = { id: bookingId };

      if (userId) {
        whereClause.userId = userId;
      }

      const booking = await Booking.findOne({
        where: whereClause,
        include: [
          {
            model: Destination,
            as: 'destination'
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Payment,
            as: 'payments'
          }
        ]
      });

      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId, filters = {}) {
    try {
      const whereClause = { userId };

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.startDate && filters.endDate) {
        whereClause.checkInDate = {
          [Op.between]: [filters.startDate, filters.endDate]
        };
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

      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, status, userId = null) {
    try {
      const booking = await this.getBookingById(bookingId, userId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.update({ status });

      // Send notification based on status
      const user = await User.findByPk(booking.userId);
      const destination = await Destination.findByPk(booking.destinationId);

      if (status === BOOKING_STATUS.CONFIRMED) {
        await emailService.sendBookingConfirmation(booking, user, destination);
      }

      return booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId, userId, reason) {
    try {
      const booking = await this.getBookingById(bookingId, userId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === BOOKING_STATUS.CANCELLED) {
        throw new Error('Booking is already cancelled');
      }

      if (booking.status === BOOKING_STATUS.COMPLETED) {
        throw new Error('Cannot cancel a completed booking');
      }

      // Calculate refund amount based on cancellation policy
      const refundAmount = this.calculateRefund(booking);

      await booking.update({
        status: BOOKING_STATUS.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
        cancelledBy: userId,
        refundAmount
      });

      // Process refund if applicable
      if (refundAmount > 0 && booking.paymentStatus === 'success') {
        await paymentService.processRefund(booking.id, refundAmount);
      }

      // Send cancellation email
      const user = await User.findByPk(booking.userId);
      const destination = await Destination.findByPk(booking.destinationId);
      await emailService.sendBookingCancellation(booking, user, destination);

      return booking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Calculate refund amount based on cancellation policy
   */
  calculateRefund(booking) {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));

    // Refund policy:
    // More than 7 days: 100% refund
    // 3-7 days: 50% refund
    // Less than 3 days: No refund
    if (daysUntilCheckIn > 7) {
      return booking.totalAmount;
    } else if (daysUntilCheckIn >= 3) {
      return booking.totalAmount * 0.5;
    } else {
      return 0;
    }
  }

  /**
   * Get all bookings (admin)
   */
  async getAllBookings(filters = {}, pagination = {}) {
    try {
      const whereClause = {};

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.userId) {
        whereClause.userId = filters.userId;
      }

      if (filters.destinationId) {
        whereClause.destinationId = filters.destinationId;
      }

      if (filters.startDate && filters.endDate) {
        whereClause.checkInDate = {
          [Op.between]: [filters.startDate, filters.endDate]
        };
      }

      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const { count, rows } = await Booking.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Destination,
            as: 'destination'
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        bookings: rows,
        total: count,
        page,
        pages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }

  /**
   * Check booking availability
   */
  async checkAvailability(destinationId, checkInDate, checkOutDate) {
    try {
      const destination = await Destination.findByPk(destinationId);

      if (!destination) {
        throw new Error('Destination not found');
      }

      // Check for overlapping bookings
      const overlappingBookings = await Booking.count({
        where: {
          destinationId,
          status: { [Op.in]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
          [Op.or]: [
            {
              checkInDate: { [Op.between]: [checkInDate, checkOutDate] }
            },
            {
              checkOutDate: { [Op.between]: [checkInDate, checkOutDate] }
            },
            {
              [Op.and]: [
                { checkInDate: { [Op.lte]: checkInDate } },
                { checkOutDate: { [Op.gte]: checkOutDate } }
              ]
            }
          ]
        }
      });

      // Assuming each destination has a capacity
      const isAvailable = overlappingBookings < (destination.capacity || 10);

      return {
        available: isAvailable,
        occupancy: overlappingBookings,
        capacity: destination.capacity || 10
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
}

module.exports = new BookingService();
