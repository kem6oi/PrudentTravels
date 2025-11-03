const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getFeaturedDestinations,
  getPopularDestinations,
  getRelatedDestinations
} = require('../controllers/destination.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validateDestination } = require('../middleware/validation.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
router.get('/', optionalAuth, getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/popular', getPopularDestinations);
router.get('/:id', optionalAuth, getDestination);
router.get('/:id/related', getRelatedDestinations);

// Admin routes
router.use(protect);
router.use(isAdmin);

router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  validateDestination,
  createDestination
);

router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  updateDestination
);

router.delete('/:id', deleteDestination);

module.exports = router;