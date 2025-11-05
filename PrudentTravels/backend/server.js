const app = require('./src/app');
const { testConnection, sequelize } = require('./src/config/database');
const { createInitialAdmin } = require('./src/utils/seeders');
const { initializeDatabase } = require('./src/utils/initDatabase');
const { runMigrations } = require('./src/utils/runMigrations');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const ensureUploadDirectories = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const tempDir = path.join(uploadsDir, 'temp');
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    }
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log('✅ Created uploads/temp directory');
    }
  } catch (error) {
    console.error('❌ Error creating upload directories:', error);
    throw error;
  }
};

// Start server
const startServer = async () => {
  try {
    // Ensure upload directories exist
    ensureUploadDirectories();
    
    // Test database connection
    await testConnection();

    // Initialize database
    if (process.env.NODE_ENV === 'development') {
      // In development, allow schema alterations
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized (development mode)');
    } else {
      // In production, use safer initialization to avoid Sequelize sync issues
      console.log('🔧 Initializing production database...');
      await initializeDatabase();
    }

    // Run database migrations
    console.log('🔄 Running database migrations...');
    await runMigrations();

    // Create initial admin user if not exists (both dev and prod)
    await createInitialAdmin();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        sequelize.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        sequelize.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();
