const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * Run all migrations in the migrations directory
 */
const runMigrations = async () => {
  const migrationsPath = path.join(__dirname, '../migrations');

  try {
    // Get all migration files
    const files = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.js'))
      .sort(); // Run in alphabetical order

    console.log(`🔄 Found ${files.length} migration files`);

    for (const file of files) {
      console.log(`🔄 Running migration: ${file}`);
      const migration = require(path.join(migrationsPath, file));

      if (migration.up && typeof migration.up === 'function') {
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Completed migration: ${file}`);
      } else {
        console.log(`⚠️  Skipping ${file}: No 'up' function found`);
      }
    }

    console.log('✅ All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
};

module.exports = { runMigrations };
