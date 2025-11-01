const { body, validationResult } = require('express-validator');

// Validation middleware wrapper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Register validation rules
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  validate
];

// Login validation rules
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Booking validation rules
const validateBooking = [
  body('destinationId')
    .notEmpty().withMessage('Destination ID is required')
    .isUUID().withMessage('Invalid destination ID'),
  body('checkInDate')
    .notEmpty().withMessage('Check-in date is required')
    .isISO8601().withMessage('Invalid check-in date format'),
  body('checkOutDate')
    .notEmpty().withMessage('Check-out date is required')
    .isISO8601().withMessage('Invalid check-out date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkInDate)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('adults')
    .notEmpty().withMessage('Number of adults is required')
    .isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('children')
    .optional()
    .isInt({ min: 0 }).withMessage('Invalid number of children'),
  body('infants')
    .optional()
    .isInt({ min: 0 }).withMessage('Invalid number of infants'),
  validate
];

// Review validation rules
const validateReview = [
  body('destinationId')
    .notEmpty().withMessage('Destination ID is required')
    .isUUID().withMessage('Invalid destination ID'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10 }).withMessage('Comment must be at least 10 characters'),
  validate
];

// Destination validation rules
const validateDestination = [
  body('name')
    .trim()
    .notEmpty().withMessage('Destination name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('shortDescription')
    .trim()
    .notEmpty().withMessage('Short description is required')
    .isLength({ max: 500 }).withMessage('Short description must not exceed 500 characters'),
  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('maxGroupSize')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid max group size'),
  body('minGroupSize')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid min group size'),
  validate
];

// Support ticket validation rules
const validateSupportTicket = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category')
    .optional()
    .isIn(['booking', 'payment', 'refund', 'technical', 'general', 'complaint'])
    .withMessage('Invalid category'),
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking,
  validateReview,
  validateDestination,
  validateSupportTicket
};