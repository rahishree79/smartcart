const express = require('express');
const router = express.Router();
const { createOrder, calculateOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.post('/calculate', calculateOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
