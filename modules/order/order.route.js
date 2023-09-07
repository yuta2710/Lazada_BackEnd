const express = require('express')
const { protect, authorize } = require('../../middleware/auth.middleware')
const {
  createOrder,
  updateOrderStatus,
  getAllOrders
} = require('./order.controller')
const router = express.Router()
router.use(protect)
router.use(authorize('customer'))

router
  .route('/')
  .get(protect, authorize('admin'), getAllOrders)
  .post(protect, authorize('admin', 'customer', 'seller'), createOrder)
router.route('/:orderId').put(updateOrderStatus)

module.exports = router
