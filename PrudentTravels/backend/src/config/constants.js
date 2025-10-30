module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    TRAVELER: 'traveler',
    SUPPORT: 'support'
  },

  // Booking Status
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REFUNDED: 'refunded'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Ticket Status
  TICKET_STATUS: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  },

  // Ticket Priority
  TICKET_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  // Destination Categories
  DESTINATION_CATEGORIES: [
    'Adventure',
    'Beach',
    'City Break',
    'Cultural',
    'Family',
    'Honeymoon',
    'Luxury',
    'Nature',
    'Religious',
    'Safari',
    'Ski',
    'Wellness'
  ],

  // File Upload Limits
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_FILES: 10
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Email Templates
  EMAIL_TEMPLATES: {
    WELCOME: 'welcome',
    BOOKING_CONFIRMATION: 'booking_confirmation',
    BOOKING_CANCELLATION: 'booking_cancellation',
    PASSWORD_RESET: 'password_reset',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed'
  }
};