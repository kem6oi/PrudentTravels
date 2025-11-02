const { User } = require('../models');
const { ROLES } = require('../config/constants');

/**
 * Create initial admin user if not exists
 */
const createInitialAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({
      where: { role: ROLES.ADMIN }
    });

    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@prudentTravels.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: adminPassword,
      role: ROLES.ADMIN,
      emailVerified: true,
      isActive: true,
      phone: null,
      bio: 'System Administrator',
      preferences: {
        newsletter: false,
        notifications: true,
        currency: 'USD',
        language: 'en'
      }
    });

    console.log('✅ Initial admin user created successfully');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Please change the default password after first login!`);
  } catch (error) {
    console.error('❌ Error creating initial admin user:', error.message);
    // Don't throw error, just log it - this allows server to start even if seeding fails
  }
};

module.exports = {
  createInitialAdmin
};
