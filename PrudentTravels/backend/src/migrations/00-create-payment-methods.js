const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create PaymentMethods table
    await queryInterface.createTable('PaymentMethods', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Country where this payment method is available'
      },
      methodType: {
        type: DataTypes.ENUM(
          'mobile_money',
          'bank_transfer',
          'cash_deposit',
          'online_banking',
          'credit_card',
          'debit_card',
          'digital_wallet',
          'other'
        ),
        allowNull: false,
        comment: 'Type of payment method'
      },
      providerName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Name of the payment provider (e.g., M-Pesa, MTN Mobile Money, Bank Name)'
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Account holder name or business name'
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Account number, phone number, or wallet ID'
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Bank name for bank transfers'
      },
      branchName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Bank branch name'
      },
      swiftCode: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'SWIFT/BIC code for international transfers'
      },
      routingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Routing number for US bank transfers'
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional instructions for making payment'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this payment method is currently active'
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Order in which to display this method'
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'USD',
        comment: 'Primary currency for this payment method'
      },
      minAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Minimum transaction amount'
      },
      maxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum transaction amount'
      },
      processingTime: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Expected processing time (e.g., "Instant", "1-3 business days")'
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to payment method logo'
      },
      metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: 'Additional metadata'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create indexes
    await queryInterface.addIndex('PaymentMethods', ['country', 'isActive'], {
      name: 'payment_methods_country_active_idx'
    });

    await queryInterface.addIndex('PaymentMethods', ['methodType'], {
      name: 'payment_methods_type_idx'
    });

    console.log('✅ Successfully created PaymentMethods table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PaymentMethods');
    console.log('✅ Successfully dropped PaymentMethods table');
  }
};
