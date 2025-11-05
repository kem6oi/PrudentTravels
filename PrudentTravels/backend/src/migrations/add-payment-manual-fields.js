const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add manual payment-related columns to Payments table

    // Check if columns already exist before adding them
    const tableDescription = await queryInterface.describeTable('Payments');

    if (!tableDescription.paymentMethodId) {
      await queryInterface.addColumn('Payments', 'paymentMethodId', {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Reference to payment method used',
        references: {
          model: 'PaymentMethods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
      console.log('✅ Added paymentMethodId column');
    }

    if (!tableDescription.transactionCode) {
      await queryInterface.addColumn('Payments', 'transactionCode', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Transaction code/reference provided by user'
      });
      console.log('✅ Added transactionCode column');
    }

    if (!tableDescription.paymentProof) {
      await queryInterface.addColumn('Payments', 'paymentProof', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to payment proof screenshot (if uploaded)'
      });
      console.log('✅ Added paymentProof column');
    }

    if (!tableDescription.verifiedBy) {
      await queryInterface.addColumn('Payments', 'verifiedBy', {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Admin ID who verified the payment',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
      console.log('✅ Added verifiedBy column');
    }

    if (!tableDescription.verifiedAt) {
      await queryInterface.addColumn('Payments', 'verifiedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the payment was verified'
      });
      console.log('✅ Added verifiedAt column');
    }

    if (!tableDescription.rejectionReason) {
      await queryInterface.addColumn('Payments', 'rejectionReason', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason if payment was rejected'
      });
      console.log('✅ Added rejectionReason column');
    }

    console.log('✅ Successfully added manual payment fields to Payments table');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove manual payment-related columns from Payments table
    await queryInterface.removeColumn('Payments', 'paymentMethodId');
    await queryInterface.removeColumn('Payments', 'transactionCode');
    await queryInterface.removeColumn('Payments', 'paymentProof');
    await queryInterface.removeColumn('Payments', 'verifiedBy');
    await queryInterface.removeColumn('Payments', 'verifiedAt');
    await queryInterface.removeColumn('Payments', 'rejectionReason');

    console.log('✅ Successfully removed manual payment fields from Payments table');
  }
};
