const { sequelize } = require('../config/database');
const { Sequelize } = require('sequelize');

// Import all models
const User = require('./user.model')(sequelize);
const Destination = require('./destination.model')(sequelize);
const DestinationImage = require('./destination-image.model')(sequelize);
const Booking = require('./booking.model')(sequelize);
const Review = require('./review.model')(sequelize);
const Payment = require('./payment.model')(sequelize);
const PaymentMethod = require('./payment-method.model')(sequelize);
const SupportTicket = require('./support-ticket.model')(sequelize);
const PromoCode = require('./promo-code.model')(sequelize);

// Define associations

// User associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
User.hasMany(SupportTicket, { foreignKey: 'userId', as: 'tickets' });
User.hasMany(SupportTicket, { foreignKey: 'assignedTo', as: 'assignedTickets' });

// Destination associations
Destination.hasMany(DestinationImage, { foreignKey: 'destinationId', as: 'images', onDelete: 'CASCADE' });
Destination.hasMany(Booking, { foreignKey: 'destinationId', as: 'bookings' });
Destination.hasMany(Review, { foreignKey: 'destinationId', as: 'reviews' });

// DestinationImage associations
DestinationImage.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });

// Booking associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Booking.hasMany(Review, { foreignKey: 'bookingId', as: 'reviews' });
Booking.hasMany(SupportTicket, { foreignKey: 'bookingId', as: 'tickets' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Payment associations
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// SupportTicket associations
SupportTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SupportTicket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
SupportTicket.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Wishlist association (many-to-many)
User.belongsToMany(Destination, { through: 'Wishlists', as: 'wishlist', foreignKey: 'userId' });
Destination.belongsToMany(User, { through: 'Wishlists', as: 'wishlistedBy', foreignKey: 'destinationId' });

// PromoCode usage association (many-to-many)
User.belongsToMany(PromoCode, { through: 'PromoCodeUsage', as: 'usedPromoCodes', foreignKey: 'userId' });
PromoCode.belongsToMany(User, { through: 'PromoCodeUsage', as: 'usedBy', foreignKey: 'promoCodeId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Destination,
  DestinationImage,
  Booking,
  Review,
  Payment,
  PaymentMethod,
  SupportTicket,
  PromoCode
};