const express = require('express');
const router = express.Router();
const {
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/BannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get active banners for homepage
router.get('/active', getActiveBanners);

// Admin protected routes
router.route('/')
  .get(protect, admin, getBanners)
  .post(protect, admin, createBanner);

router.route('/:id')
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;
