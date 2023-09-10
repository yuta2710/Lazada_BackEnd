const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getAllOrdersByUserId,
} = require("./order.controller");
const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), getAllOrders)
  .post(protect, createOrder);

router
  .route("/:userId")
  .get(protect, authorize("customer", "seller"), getAllOrdersByUserId);
router
  .route("/:orderId/:productId")
  .put(protect, authorize("seller", "customer"), updateOrderStatus);

module.exports = router;
