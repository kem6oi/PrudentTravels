const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const paymentMethodController = require('../controllers/payment-method.controller');

// Public routes (for users during checkout)
router.get('/countries', paymentMethodController.getAvailableCountries);
router.get('/by-country/:country', paymentMethodController.getPaymentMethodsByCountry);

// Protected routes (require authentication)
router.use(protect);

// Admin routes (payment method management)
router.get('/', isAdmin, paymentMethodController.getAllPaymentMethods);
router.get('/:id', isAdmin, paymentMethodController.getPaymentMethodById);
router.post('/', isAdmin, paymentMethodController.createPaymentMethod);
router.put('/:id', isAdmin, paymentMethodController.updatePaymentMethod);
router.delete('/:id', isAdmin, paymentMethodController.deletePaymentMethod);

module.exports = router;
