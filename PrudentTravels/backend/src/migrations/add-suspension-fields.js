const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add suspension-related columns to Users table

    // Check if columns already exist before adding them
    const tableDescription = await queryInterface.describeTable('Users');

    if (!tableDescription.isSuspended) {
      await queryInterface.addColumn('Users', 'isSuspended', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });
      console.log('✅ Added isSuspended column');
    } else {
      console.log('⏭️  isSuspended column already exists');
    }

    if (!tableDescription.suspendedAt) {
      await queryInterface.addColumn('Users', 'suspendedAt', {
        type: Sequelize.DATE,
        allowNull: true
      });
      console.log('✅ Added suspendedAt column');
    } else {
      console.log('⏭️  suspendedAt column already exists');
    }

    if (!tableDescription.suspensionReason) {
      await queryInterface.addColumn('Users', 'suspensionReason', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      console.log('✅ Added suspensionReason column');
    } else {
      console.log('⏭️  suspensionReason column already exists');
    }

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
