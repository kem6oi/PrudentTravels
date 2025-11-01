const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add suspension-related columns to Users table
    await queryInterface.addColumn('Users', 'isSuspended', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Users', 'suspendedAt', {
      type: DataTypes.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'suspensionReason', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    console.log('✅ Successfully added suspension fields to Users table');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove suspension-related columns from Users table
    await queryInterface.removeColumn('Users', 'isSuspended');
    await queryInterface.removeColumn('Users', 'suspendedAt');
    await queryInterface.removeColumn('Users', 'suspensionReason');

    console.log('✅ Successfully removed suspension fields from Users table');
  }
};
