const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromoCode = sequelize.define('PromoCode', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    minimumPurchase: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    maximumDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    usageLimitPerUser: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    applicableDestinations: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    applicableCategories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    excludedDestinations: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    timestamps: true
  });

  return PromoCode;
};