const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
} = require('../controllers/OrderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, placeOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
