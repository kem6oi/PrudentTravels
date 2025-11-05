const { DataTypes } = require('sequelize');
const { BOOKING_STATUS } = require('../config/constants');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    destinationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Destinations',
        key: 'id'
      }
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    children: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    infants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    totalGuests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    taxes: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM(Object.values(BOOKING_STATUS)),
      defaultValue: BOOKING_STATUS.PENDING
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    promoCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    guestDetails: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledBy: {
      type: DataTypes.UUID,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    hooks: {
      beforeValidate: (booking) => {
        // Generate booking number if not already set (for new bookings)
        if (!booking.bookingNumber) {
          const date = new Date();
          const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          booking.bookingNumber = `PT${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${random}`;
        }

        // Calculate total guests (handles undefined values with || 0)
        const adults = booking.adults || 0;
        const children = booking.children || 0;
        const infants = booking.infants || 0;
        booking.totalGuests = adults + children + infants;
      },
      beforeUpdate: (booking) => {
        // Recalculate total guests if any guest count changed
        if (booking.changed('adults') || booking.changed('children') || booking.changed('infants')) {
          const adults = booking.adults || 0;
          const children = booking.children || 0;
          const infants = booking.infants || 0;
          booking.totalGuests = adults + children + infants;
        }
      }
    }
  });

  return Booking;
};