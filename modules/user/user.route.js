const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateSellerBusiness,
  acceptUserStatus,
} = require("./user.controller");
const { protect, authorize } = require("../../middleware/auth.middleware");
const userModel = require("./user.model");
const router = express.Router(); // merge the relationship of entities
const dynamicQueryResponse = require("../../middleware/dynamicQueryResponse.middleware");

router
  .route("/")
  .get(protect, authorize("admin"), getAllUsers)
  .post(protect, authorize("admin"), createUser);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

router.route("/:id/status").put(protect, authorize("admin"), acceptUserStatus);

router
  .route("/:id/business")
  .put(protect, authorize("admin", "seller"), updateSellerBusiness);

module.exports = router;

// user là customer, nó chỉ coi những order mà nó tạo ra
// user là seller, nó chỉ coi được những order có sản phẩm của nó

// getorderbyUserId
// getorderbysellerId
