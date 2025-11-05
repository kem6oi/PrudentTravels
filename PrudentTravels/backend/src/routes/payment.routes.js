const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  getUserPayments,
  processRefund,
  handleWebhook,
  getPendingPayments,
  verifyPayment,
  rejectPayment
} = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Webhook route (no authentication required, verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(protect);

// Admin routes - must come before /:id route to avoid conflicts
router.get('/pending', authorize('admin'), getPendingPayments);
router.post('/refund', authorize('admin'), processRefund);
router.put('/:id/verify', authorize('admin'), verifyPayment);
router.put('/:id/reject', authorize('admin'), rejectPayment);

// User payment routes
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/my-payments', getUserPayments);
router.get('/:id', getPaymentDetails);

module.exports = router;
