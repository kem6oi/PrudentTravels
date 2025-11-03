const app = require('./src/app');
const { testConnection, sequelize } = require('./src/config/database');
const { createInitialAdmin } = require('./src/utils/seeders');
const { initializeDatabase } = require('./src/utils/initDatabase');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
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
