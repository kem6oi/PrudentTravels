const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'PrudentTravels'} <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to PrudentTravels!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to PrudentTravels, ${user.firstName}!</h1>
        <p>Thank you for joining our community of travelers.</p>
        <p>We're excited to help you discover amazing destinations around the world.</p>
        <p>To get started, please verify your email address by clicking the link below:</p>
        <a href="${process.env.CLIENT_URL}/verify-email/${user.emailVerificationToken}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Happy travels!</p>
        <p>The PrudentTravels Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${user.firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>The PrudentTravels Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendBookingConfirmation(booking, user, destination) {
    const subject = `Booking Confirmation - ${booking.bookingNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">Booking Confirmed!</h1>
        <p>Dear ${user.firstName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Destination:</strong> ${destination.name}</p>
          <p><strong>Check-in Date:</strong> ${booking.checkInDate}</p>
          <p><strong>Check-out Date:</strong> ${booking.checkOutDate}</p>
          <p><strong>Total Guests:</strong> ${booking.totalGuests}</p>
          <p><strong>Total Amount:</strong> ${booking.currency} ${booking.totalAmount}</p>
        </div>
        
        <p>You can view and manage your booking in your dashboard.</p>
        <a href="${process.env.CLIENT_URL}/dashboard/bookings/${booking.id}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          View Booking
        </a>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Thank you for choosing PrudentTravels!</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendBookingCancellation(booking, user, destination) {
    const subject = `Booking Cancellation - ${booking.bookingNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Booking Cancelled</h2>
        <p>Dear ${user.firstName},</p>
        <p>Your booking has been cancelled as requested.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Cancelled Booking Details</h3>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Destination:</strong> ${destination.name}</p>
          <p><strong>Original Dates:</strong> ${booking.checkInDate} to ${booking.checkOutDate}</p>
          ${booking.refundAmount ? `<p><strong>Refund Amount:</strong> ${booking.currency} ${booking.refundAmount}</p>` : ''}
        </div>
        
        ${booking.refundAmount ? '<p>Your refund will be processed within 5-7 business days.</p>' : ''}
        
        <p>We hope to serve you again in the future.</p>
        <p>Best regards,<br>The PrudentTravels Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendPaymentSuccess(payment, user, booking) {
    const subject = 'Payment Successful';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Payment Successful!</h2>
        <p>Dear ${user.firstName},</p>
        <p>Your payment has been successfully processed.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Payment Details</h3>
          <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Amount Paid:</strong> ${payment.currency} ${payment.amount}</p>
          <p><strong>Payment Method:</strong> ${payment.method}</p>
        </div>
        
        <p>A receipt has been sent to your email.</p>
        <p>Thank you for your payment!</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendSupportTicketCreated(ticket, user) {
    const subject = `Support Ticket Created - ${ticket.ticketNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Support Ticket Created</h2>
        <p>Dear ${user.firstName},</p>
        <p>We've received your support request and created a ticket for you.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Category:</strong> ${ticket.category}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
        </div>
        
        <p>Our support team will review your request and respond as soon as possible.</p>
        <p>You can track your ticket status in your dashboard.</p>
        
        <a href="${process.env.CLIENT_URL}/dashboard/support/${ticket.id}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          View Ticket
        </a>
        
        <p>Best regards,<br>The PrudentTravels Support Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendAccountSuspension(user) {
    const subject = 'Account Suspension Notice - PrudentTravels';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Account Suspension Notice</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>We regret to inform you that your PrudentTravels account has been suspended.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0;"><strong>Suspension Details:</strong></p>
          <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date(user.suspendedAt).toLocaleDateString()}</p>
          ${user.suspensionReason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${user.suspensionReason}</p>` : ''}
        </div>
        
        <p>While your account is suspended, you will not be able to:</p>
        <ul style="color: #666;">
          <li>Log in to your account</li>
          <li>Make new bookings</li>
          <li>Access your dashboard</li>
          <li>Use PrudentTravels services</li>
        </ul>
        
        <p><strong>What you can do:</strong></p>
        <p>If you believe this suspension was made in error or would like to appeal this decision, please contact our support team immediately.</p>
        
        <a href="${process.env.CLIENT_URL}/contact" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Contact Support
        </a>
        
        <p>You can also reply directly to this email, and our support team will assist you.</p>
        
        <p>We appreciate your understanding.</p>
        
        <p>Best regards,<br>The PrudentTravels Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }
}

module.exports = new EmailService();