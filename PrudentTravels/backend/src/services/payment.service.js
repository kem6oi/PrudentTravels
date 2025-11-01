const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Booking, User } = require('../models');
const { PAYMENT_STATUS, BOOKING_STATUS } = require('../config/constants');
const emailService = require('./email.service');
const notificationService = require('./notification.service');

class PaymentService {
  /**
   * Create payment intent
   */
  async createPaymentIntent(bookingId, userId) {
    try {
      const booking = await Booking.findOne({
        where: { id: bookingId, userId }
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.paymentStatus === 'success') {
        throw new Error('Booking has already been paid');
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Convert to cents
        currency: booking.currency.toLowerCase(),
        metadata: {
          bookingId: booking.id,
          userId: userId
        },
        description: `Payment for booking ${booking.bookingNumber}`
      });

      // Create payment record
      const payment = await Payment.create({
        bookingId: booking.id,
        userId: userId,
        amount: booking.totalAmount,
        currency: booking.currency,
        method: 'stripe',
        status: PAYMENT_STATUS.PENDING,
        transactionId: paymentIntent.id,
        metadata: {
          paymentIntentId: paymentIntent.id
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        amount: booking.totalAmount
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm payment
   */
  async confirmPayment(paymentId, paymentIntentId) {
    try {
      const payment = await Payment.findByPk(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update payment status
        await payment.update({
          status: PAYMENT_STATUS.SUCCESS,
          paidAt: new Date(),
          metadata: {
            ...payment.metadata,
            paymentIntent
          }
        });

        // Update booking status and payment status
        const booking = await Booking.findByPk(payment.bookingId, {
          include: [
            { model: User, as: 'user' },
            { model: require('../models').Destination, as: 'destination' }
          ]
        });

        await booking.update({
          status: BOOKING_STATUS.CONFIRMED,
          paymentStatus: 'success',
          paymentMethod: 'stripe'
        });

        // Send confirmation emails
        await emailService.sendBookingConfirmation(booking, booking.user, booking.destination);
        await emailService.sendPaymentSuccess(payment, booking.user, booking);

        return { success: true, payment, booking };
      } else {
        await payment.update({
          status: PAYMENT_STATUS.FAILED,
          metadata: {
            ...payment.metadata,
            failureReason: paymentIntent.last_payment_error?.message
          }
        });

        return { success: false, payment };
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(bookingId, amount) {
    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Find the successful payment for this booking
      const payment = await Payment.findOne({
        where: {
          bookingId: booking.id,
          status: PAYMENT_STATUS.SUCCESS
        }
      });

      if (!payment) {
        throw new Error('No successful payment found for this booking');
      }

      // Create refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: Math.round(amount * 100), // Convert to cents
        reason: 'requested_by_customer'
      });

      // Create refund payment record
      const refundPayment = await Payment.create({
        bookingId: booking.id,
        userId: booking.userId,
        amount: -amount, // Negative amount for refund
        currency: booking.currency,
        method: 'stripe',
        status: PAYMENT_STATUS.REFUNDED,
        transactionId: refund.id,
        metadata: {
          refundId: refund.id,
          originalPaymentId: payment.id
        }
      });

      // Update booking
      await booking.update({
        status: BOOKING_STATUS.REFUNDED,
        refundAmount: amount,
        refundedAt: new Date()
      });

      return { success: true, refund: refundPayment };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'charge.refunded':
          await this.handleRefund(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntent) {
    try {
      const payment = await Payment.findOne({
        where: { transactionId: paymentIntent.id }
      });

      if (payment && payment.status !== PAYMENT_STATUS.SUCCESS) {
        await this.confirmPayment(payment.id, paymentIntent.id);
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(paymentIntent) {
    try {
      const payment = await Payment.findOne({
        where: { transactionId: paymentIntent.id }
      });

      if (payment) {
        await payment.update({
          status: PAYMENT_STATUS.FAILED,
          metadata: {
            ...payment.metadata,
            failureReason: paymentIntent.last_payment_error?.message
          }
        });

        const booking = await Booking.findByPk(payment.bookingId, {
          include: [{ model: User, as: 'user' }]
        });

        // Notify user about payment failure
        await notificationService.sendNotification(
          booking.userId,
          'payment_failed',
          { payment, booking }
        );
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  /**
   * Handle refund
   */
  async handleRefund(charge) {
    try {
      // Find the payment and update status
      const payment = await Payment.findOne({
        where: { transactionId: charge.payment_intent }
      });

      if (payment) {
        await payment.update({
          status: PAYMENT_STATUS.REFUNDED
        });
      }
    } catch (error) {
      console.error('Error handling refund:', error);
      throw error;
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId, userId = null) {
    try {
      const whereClause = { id: paymentId };

      if (userId) {
        whereClause.userId = userId;
      }

      const payment = await Payment.findOne({
        where: whereClause,
        include: [
          {
            model: Booking,
            as: 'booking',
            include: [
              { model: require('../models').Destination, as: 'destination' }
            ]
          }
        ]
      });

      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }

  /**
   * Get user payments
   */
  async getUserPayments(userId) {
    try {
      const payments = await Payment.findAll({
        where: { userId },
        include: [
          {
            model: Booking,
            as: 'booking'
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return payments;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
