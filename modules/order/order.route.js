const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const { createOrder, updateOrderStatus } = require("./order.controller");
const router = express.Router();

router.use(protect);
router.use(authorize("customer"));

// router.route("/").get(getAllProducts).post(createProduct);
router.route("/:orderId").put(updateOrderStatus);

router.route("/:cartId").post(createOrder);

module.exports = router;
