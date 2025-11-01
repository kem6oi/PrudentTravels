const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  getUserBookings,
  getUserReviews,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updatePreferences,
  deleteAccount
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// User data routes
router.get('/bookings', getUserBookings);
router.get('/reviews', getUserReviews);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:destinationId', removeFromWishlist);

// Preferences
router.put('/preferences', updatePreferences);

// Account management
router.delete('/account', deleteAccount);

module.exports = router;
