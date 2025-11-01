const { body, param, query, validationResult } = require('express-validator');

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 */
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate UUID
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validate URL
 */
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if date is future date
 */
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Check if checkout date is after checkin date
 */
const isValidDateRange = (checkIn, checkOut) => {
  return new Date(checkOut) > new Date(checkIn);
};

/**
 * Booking validation rules
 */
const validateBooking = [
  body('destinationId')
    .notEmpty().withMessage('Destination ID is required')
    .isUUID().withMessage('Invalid destination ID'),
  body('checkInDate')
    .notEmpty().withMessage('Check-in date is required')
    .isDate().withMessage('Invalid check-in date')
    .custom(value => isFutureDate(value)).withMessage('Check-in date must be in the future'),
  body('checkOutDate')
    .notEmpty().withMessage('Check-out date is required')
    .isDate().withMessage('Invalid check-out date')
    .custom((value, { req }) => isValidDateRange(req.body.checkInDate, value))
    .withMessage('Check-out date must be after check-in date'),
  body('adults')
    .notEmpty().withMessage('Number of adults is required')
    .isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('children')
    .optional()
    .isInt({ min: 0 }).withMessage('Children must be a positive number'),
  body('infants')
    .optional()
    .isInt({ min: 0 }).withMessage('Infants must be a positive number')
];

/**
 * Review validation rules
 */
const validateReview = [
  body('bookingId')
    .notEmpty().withMessage('Booking ID is required')
    .isUUID().withMessage('Invalid booking ID'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
];

/**
 * User update validation rules
 */
const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .custom(value => !value || isValidPhone(value)).withMessage('Invalid phone number'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email address')
];

/**
 * Payment validation rules
 */
const validatePayment = [
  body('bookingId')
    .notEmpty().withMessage('Booking ID is required')
    .isUUID().withMessage('Invalid booking ID'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('paymentMethodId')
    .notEmpty().withMessage('Payment method is required')
];

/**
 * Support ticket validation rules
 */
const validateSupportTicket = [
  body('subject')
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['general', 'booking', 'payment', 'technical', 'feedback'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
];

/**
 * Promo code validation rules
 */
const validatePromoCode = [
  body('code')
    .notEmpty().withMessage('Promo code is required')
    .isLength({ min: 3, max: 20 }).withMessage('Promo code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/).withMessage('Promo code must contain only uppercase letters and numbers')
];

/**
 * Validate request middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  // Validators
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidUUID,
  isValidDate,
  isValidURL,
  isFutureDate,
  isValidDateRange,

  // Validation rules
  validateBooking,
  validateReview,
  validateUserUpdate,
  validatePayment,
  validateSupportTicket,
  validatePromoCode,

  // Middleware
  validate
};
