const { DataTypes } = require('sequelize');
const { TICKET_STATUS, TICKET_PRIORITY } = require('../config/constants');

module.exports = (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticketNumber: {
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
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('booking', 'payment', 'refund', 'technical', 'general', 'complaint'),
      defaultValue: 'general'
    },
    status: {
      type: DataTypes.ENUM(Object.values(TICKET_STATUS)),
      defaultValue: TICKET_STATUS.OPEN
    },
    priority: {
      type: DataTypes.ENUM(Object.values(TICKET_PRIORITY)),
      defaultValue: TICKET_PRIORITY.MEDIUM
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    internalNotes: {
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
      beforeCreate: (ticket) => {
        // Generate ticket number
        const date = new Date();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        ticket.ticketNumber = `TKT${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${random}`;
      }
    }
  });

  return SupportTicket;
};