const { sequelize, User, Destination, DestinationImage, Booking, Review, Payment, SupportTicket, PromoCode } = require('../models');

/**
 * Initialize database tables in production
 * This is safer than using sequelize.sync() in production
 */
const initializeDatabase = async () => {
  const queryInterface = sequelize.getQueryInterface();

  try {
    // Check if Users table exists
    const tables = await queryInterface.showAllTables();
    console.log(`📊 Existing tables: ${tables.join(', ') || 'none'}`);

    if (tables.length === 0) {
      console.log('🔨 No tables found, creating database schema...');

      // Create tables in order (respecting foreign key dependencies)
      const modelsInOrder = [
        User,
        Destination,
        DestinationImage,
        PromoCode,
        Booking,
        Payment,
        Review,
        SupportTicket
      ];

      for (const model of modelsInOrder) {
        try {
          await model.sync({ force: false });
          console.log(`✅ Created table: ${model.tableName}`);
        } catch (error) {
          console.error(`❌ Error creating table ${model.tableName}:`, error.message);
        }
      }

      // Create junction tables for many-to-many relationships
      try {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS "Wishlists" (
            "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "destinationId" UUID NOT NULL REFERENCES "Destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            PRIMARY KEY ("userId", "destinationId")
          );
        `);
        console.log('✅ Created table: Wishlists');
      } catch (error) {
        console.error('❌ Error creating Wishlists table:', error.message);
      }

      try {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS "PromoCodeUsage" (
            "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "promoCodeId" UUID NOT NULL REFERENCES "PromoCodes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "usedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            PRIMARY KEY ("userId", "promoCodeId")
          );
        `);
        console.log('✅ Created table: PromoCodeUsage');
      } catch (error) {
        console.error('❌ Error creating PromoCodeUsage table:', error.message);
      }

      console.log('✅ Database schema creation completed');
    } else {
      console.log('✅ Database tables already exist, skipping creation');
    }

    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };
