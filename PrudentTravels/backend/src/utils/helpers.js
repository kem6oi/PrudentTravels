const crypto = require('crypto');

/**
 * Generate a unique booking number
 */
const generateBookingNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PT${year}${month}${random}`;
};

/**
 * Generate a unique ticket number
 */
const generateTicketNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TKT${year}${month}${random}`;
};

/**
 * Generate random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Calculate number of days between two dates
 */
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate total price for booking
 */
const calculateBookingPrice = (basePrice, nights, guests, taxes = 0, discount = 0) => {
  const subtotal = basePrice * nights;
  const taxAmount = (subtotal * taxes) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

/**
 * Paginate results
 */
const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

/**
 * Format pagination response
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Generate slug from text
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Check if date is in the past
 */
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 */
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Format date to readable string
 */
const formatDate = (date, locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generate random string
 */
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove undefined properties from object
 */
const removeUndefined = (obj) => {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
};

module.exports = {
  generateBookingNumber,
  generateTicketNumber,
  generateToken,
  calculateDays,
  calculateBookingPrice,
  getPagination,
  getPagingData,
  sanitizeInput,
  formatCurrency,
  generateSlug,
  isPastDate,
  isFutureDate,
  formatDate,
  generateRandomString,
  deepClone,
  removeUndefined
};
