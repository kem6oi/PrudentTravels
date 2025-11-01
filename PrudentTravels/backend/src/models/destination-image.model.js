const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DestinationImage = sequelize.define('DestinationImage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    destinationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Destinations',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true
  });

  return DestinationImage;
};