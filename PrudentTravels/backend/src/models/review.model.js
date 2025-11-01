const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pros: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    cons: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adminResponseAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    timestamps: true
  });

  return Review;
};