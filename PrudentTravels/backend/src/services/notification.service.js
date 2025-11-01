const emailService = require('./email.service');
const { User, Booking, SupportTicket } = require('../models');

class NotificationService {
  /**
   * Send notification to user
   */
  async sendNotification(userId, type, data) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Check user preferences
      if (!user.preferences?.notifications) {
        console.log(`Notifications disabled for user ${userId}`);
        return;
      }

      switch (type) {
        case 'booking_confirmation':
          await this.sendBookingConfirmation(user, data);
          break;
        case 'booking_reminder':
          await this.sendBookingReminder(user, data);
          break;
        case 'booking_cancellation':
          await this.sendBookingCancellation(user, data);
          break;
        case 'payment_success':
          await this.sendPaymentSuccess(user, data);
          break;
        case 'payment_failed':
          await this.sendPaymentFailed(user, data);
          break;
        case 'support_ticket_update':
          await this.sendSupportTicketUpdate(user, data);
          break;
        case 'promotional':
          await this.sendPromotionalEmail(user, data);
          break;
        default:
          console.log(`Unknown notification type: ${type}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(user, bookingData) {
    const { booking, destination } = bookingData;
    await emailService.sendBookingConfirmation(booking, user, destination);
  }

  /**
   * Send booking reminder (24 hours before check-in)
   */
  async sendBookingReminder(user, bookingData) {
    const { booking, destination } = bookingData;

    const subject = `Reminder: Your trip to ${destination.name} is tomorrow!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Trip Reminder</h2>
        <p>Dear ${user.firstName},</p>
        <p>This is a friendly reminder that your trip to ${destination.name} is scheduled for tomorrow!</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Destination:</strong> ${destination.name}</p>
          <p><strong>Check-in:</strong> ${booking.checkInDate}</p>
          <p><strong>Check-out:</strong> ${booking.checkOutDate}</p>
          <p><strong>Guests:</strong> ${booking.totalGuests}</p>
        </div>

        <p>Have a wonderful trip!</p>
        <p>Safe travels,<br>The PrudentTravels Team</p>
      </div>
    `;

    await emailService.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send booking cancellation notification
   */
  async sendBookingCancellation(user, bookingData) {
    const { booking, destination } = bookingData;
    await emailService.sendBookingCancellation(booking, user, destination);
  }

  /**
   * Send payment success notification
   */
  async sendPaymentSuccess(user, paymentData) {
    const { payment, booking } = paymentData;
    await emailService.sendPaymentSuccess(payment, user, booking);
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailed(user, paymentData) {
    const { payment, booking } = paymentData;

    const subject = 'Payment Failed';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Payment Failed</h2>
        <p>Dear ${user.firstName},</p>
        <p>Unfortunately, your payment for booking ${booking.bookingNumber} could not be processed.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Amount:</strong> ${payment.currency} ${payment.amount}</p>
          <p><strong>Reason:</strong> ${payment.failureReason || 'Payment declined'}</p>
        </div>

        <p>Please try again or use a different payment method.</p>

        <a href="${process.env.CLIENT_URL}/bookings/${booking.id}/payment"
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Retry Payment
        </a>

        <p>If you continue to experience issues, please contact our support team.</p>
        <p>Best regards,<br>The PrudentTravels Team</p>
      </div>
    `;

    await emailService.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send support ticket update notification
   */
  async sendSupportTicketUpdate(user, ticketData) {
    const { ticket, message } = ticketData;

    const subject = `Support Ticket Update - ${ticket.ticketNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Support Ticket Updated</h2>
        <p>Dear ${user.firstName},</p>
        <p>Your support ticket has been updated.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p><strong>Latest Update:</strong></p>
          <p>${message}</p>
        </div>

        <a href="${process.env.CLIENT_URL}/dashboard/support/${ticket.id}"
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          View Ticket
        </a>

        <p>Best regards,<br>The PrudentTravels Support Team</p>
      </div>
    `;

    await emailService.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send promotional email
   */
  async sendPromotionalEmail(user, promoData) {
    const { subject, content, ctaText, ctaLink } = promoData;

    // Check if user has opted in for promotional emails
    if (!user.preferences?.newsletter) {
      console.log(`User ${user.id} has not opted in for promotional emails`);
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <p>Dear ${user.firstName},</p>
        ${content}

        ${ctaText && ctaLink ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaLink}"
               style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              ${ctaText}
            </a>
          </div>
        ` : ''}

        <p>Happy travels!<br>The PrudentTravels Team</p>

        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          You're receiving this email because you're subscribed to our newsletter.
          <a href="${process.env.CLIENT_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;

    await emailService.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(userIds, type, data) {
    try {
      const promises = userIds.map(userId =>
        this.sendNotification(userId, type, data).catch(err => {
          console.error(`Failed to send notification to user ${userId}:`, err);
          return null;
        })
      );

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Schedule booking reminders
   */
  async scheduleBookingReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);

      // Find bookings with check-in tomorrow
      const upcomingBookings = await Booking.findAll({
        where: {
          checkInDate: {
            [require('sequelize').Op.between]: [tomorrow, nextDay]
          },
          status: 'confirmed'
        },
        include: [
          { model: User, as: 'user' },
          { model: require('../models').Destination, as: 'destination' }
        ]
      });

      // Send reminders
      for (const booking of upcomingBookings) {
        await this.sendNotification(booking.userId, 'booking_reminder', {
          booking,
          destination: booking.destination
        });
      }

      console.log(`Sent ${upcomingBookings.length} booking reminders`);
    } catch (error) {
      console.error('Error scheduling booking reminders:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
