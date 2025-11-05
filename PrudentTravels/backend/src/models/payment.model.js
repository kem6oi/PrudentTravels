const { DataTypes } = require('sequelize');
const { PAYMENT_STATUS } = require('../config/constants');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    transactionId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM(Object.values(PAYMENT_STATUS)),
      defaultValue: PAYMENT_STATUS.PENDING
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'stripe'
    },
    providerTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    providerResponse: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    hooks: {
      beforeValidate: (payment) => {
        // Generate transaction ID if not already set
        if (!payment.transactionId) {
          const date = new Date();
          const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          payment.transactionId = `TXN${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${random}`;
        }
      }
    }
  });

  return Payment;
};