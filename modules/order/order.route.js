const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  createOrder,
  updateOrderStatus,
  getAllOrders,
} = require("./order.controller");
const router = express.Router();

router.use(protect);
router.use(authorize("customer"));

// router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/")
  .get(protect, authorize("admin"), getAllOrders)
  .post(protect, authorize("customer"), createOrder);
router.route("/:orderId").put(updateOrderStatus);

module.exports = router;
