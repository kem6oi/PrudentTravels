require('dotenv').config();

module.exports = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  from: process.env.EMAIL_FROM || 'noreply@prudentTravels.com',
  fromName: process.env.EMAIL_FROM_NAME || 'PrudentTravels',

  // Email templates configuration
  templates: {
    welcome: {
      subject: 'Welcome to PrudentTravels!',
      template: 'welcome'
    },
    bookingConfirmation: {
      subject: 'Booking Confirmation',
      template: 'booking-confirmation'
    },
    bookingCancellation: {
      subject: 'Booking Cancellation',
      template: 'booking-cancellation'
    },
    passwordReset: {
      subject: 'Password Reset Request',
      template: 'password-reset'
    },
    paymentSuccess: {
      subject: 'Payment Successful',
      template: 'payment-success'
    },
    paymentFailed: {
      subject: 'Payment Failed',
      template: 'payment-failed'
    },
    supportTicket: {
      subject: 'Support Ticket Created',
      template: 'support-ticket'
    }
  }
};
