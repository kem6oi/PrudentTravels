const { DataTypes } = require('sequelize');
const { DESTINATION_CATEGORIES } = require('../config/constants');

module.exports = (sequelize) => {
  const Destination = sequelize.define('Destination', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coordinates: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        latitude: null,
        longitude: null
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    duration: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        days: 1,
        nights: 0
      }
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    highlights: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    included: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    notIncluded: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    itinerary: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    maxGroupSize: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      validate: {
        min: 1
      }
    },
    minGroupSize: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    difficulty: {
      type: DataTypes.ENUM('Easy', 'Moderate', 'Challenging', 'Difficult'),
      defaultValue: 'Easy'
    },
    ageRange: {
      type: DataTypes.JSON,
      defaultValue: {
        min: 0,
        max: 99
      }
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['English']
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    bookingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seoKeywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: (destination) => {
        // Generate slug from name if not provided
        if (!destination.slug) {
          destination.slug = destination.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      }
    }
  });

  return Destination;
};