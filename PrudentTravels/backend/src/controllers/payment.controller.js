const paymentService = require('../services/payment.service');
const { successResponse, errorResponse, createdResponse } = require('../utils/response');

/**
 * Create payment intent
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return errorResponse(res, 'Booking ID is required', 400);
    }

    const result = await paymentService.createPaymentIntent(bookingId, req.user.id);

    return createdResponse(res, result, 'Payment intent created successfully');
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return errorResponse(res, error.message || 'Error creating payment intent', 400);
  }
};

/**
 * Confirm payment
 */
const confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;

    if (!paymentId || !paymentIntentId) {
      return errorResponse(res, 'Payment ID and Payment Intent ID are required', 400);
    }

    const result = await paymentService.confirmPayment(paymentId, paymentIntentId);

    if (result.success) {
      return successResponse(res, result, 'Payment confirmed successfully');
    } else {
      return errorResponse(res, 'Payment failed', 400);
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return errorResponse(res, error.message || 'Error confirming payment', 400);
  }
};

/**
 * Get payment details
 */
const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own payments, admins can view all
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const payment = await paymentService.getPaymentDetails(id, userId);

    if (!payment) {
      return errorResponse(res, 'Payment not found', 404);
    }

    return successResponse(res, payment, 'Payment details fetched successfully');
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return errorResponse(res, 'Error fetching payment details', 500);
  }
};

/**
 * Get user payments
 */
const getUserPayments = async (req, res) => {
  try {
    const payments = await paymentService.getUserPayments(req.user.id);

    return successResponse(res, payments, 'Payments fetched successfully');
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return errorResponse(res, 'Error fetching payments', 500);
  }
};

/**
 * Process refund (admin only)
 */
const processRefund = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return errorResponse(res, 'Booking ID and amount are required', 400);
    }

    const result = await paymentService.processRefund(bookingId, parseFloat(amount));

    return successResponse(res, result, 'Refund processed successfully');
  } catch (error) {
    console.error('Error processing refund:', error);
    return errorResponse(res, error.message || 'Error processing refund', 400);
  }
};

/**
 * Handle Stripe webhook
 */
const handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return errorResponse(res, 'Webhook signature verification failed', 400);
    }

    await paymentService.handleWebhook(event);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return errorResponse(res, 'Error handling webhook', 500);
  }
};

/**
 * Get all pending payments (admin only)
 */
const getPendingPayments = async (req, res) => {
  try {
    const payments = await paymentService.getPendingPayments();

    return successResponse(res, payments, 'Pending payments fetched successfully');
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return errorResponse(res, 'Error fetching pending payments', 500);
  }
};

/**
 * Verify/approve payment (admin only)
 */
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const payment = await paymentService.verifyPayment(id, adminId);

    return successResponse(res, payment, 'Payment verified successfully');
  } catch (error) {
    console.error('Error verifying payment:', error);
    return errorResponse(res, error.message || 'Error verifying payment', 400);
  }
};

/**
 * Reject payment (admin only)
 */
const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!reason) {
      return errorResponse(res, 'Rejection reason is required', 400);
    }

    const payment = await paymentService.rejectPayment(id, adminId, reason);

    return successResponse(res, payment, 'Payment rejected');
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return errorResponse(res, error.message || 'Error rejecting payment', 400);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  getUserPayments,
  processRefund,
  handleWebhook,
  getPendingPayments,
  verifyPayment,
  rejectPayment
};
