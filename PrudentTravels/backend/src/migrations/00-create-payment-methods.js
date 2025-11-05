const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if PaymentMethods table already exists
    const tables = await queryInterface.showAllTables();
    if (tables.includes('PaymentMethods')) {
      console.log('⏭️  PaymentMethods table already exists, skipping creation');
      return;
    }

    // Create PaymentMethods table
    await queryInterface.createTable('PaymentMethods', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Country where this payment method is available'
      },
      methodType: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the payment provider (e.g., M-Pesa, MTN Mobile Money, Bank Name)'
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Account holder name or business name'
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Account number, phone number, or wallet ID'
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Bank name for bank transfers'
      },
      branchName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Bank branch name'
      },
      swiftCode: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'SWIFT/BIC code for international transfers'
      },
      routingNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Routing number for US bank transfers'
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Additional instructions for making payment'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this payment method is currently active'
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Order in which to display this method'
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD',
        comment: 'Primary currency for this payment method'
      },
      minAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Minimum transaction amount'
      },
      maxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum transaction amount'
      },
      processingTime: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Expected processing time (e.g., "Instant", "1-3 business days")'
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to payment method logo'
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {},
        comment: 'Additional metadata'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes
    try {
      await queryInterface.addIndex('PaymentMethods', ['country', 'isActive'], {
        name: 'payment_methods_country_active_idx'
      });
      console.log('✅ Created index: payment_methods_country_active_idx');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⏭️  Index payment_methods_country_active_idx already exists');
      } else {
        throw error;
      }
    }

    try {
      await queryInterface.addIndex('PaymentMethods', ['methodType'], {
        name: 'payment_methods_type_idx'
      });
      console.log('✅ Created index: payment_methods_type_idx');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⏭️  Index payment_methods_type_idx already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Successfully created PaymentMethods table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PaymentMethods');
    console.log('✅ Successfully dropped PaymentMethods table');
  }
};
