const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getAllOrdersBySellerId,
} = require("./order.controller");
const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), getAllOrders)
  .post(protect, createOrder);

router.route("/:sellerId").get(getAllOrdersBySellerId);
router.route("/:orderId").put(updateOrderStatus);

module.exports = router;
