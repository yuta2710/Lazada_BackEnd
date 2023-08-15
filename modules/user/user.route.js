const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateSellerBusiness,
} = require("./user.controller");
const { protect, authorize } = require("../../middleware/auth.middleware");
const router = express.Router(); // merge the relationship of entities

// router.use(protect);
// router.use(authorize("admin"));

router
  .route("/")
  .get(protect, authorize("admin"), getAllUsers)
  .post(protect, authorize("admin"), createUser);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

router
  .route("/:id/business")
  .put(protect, authorize("admin", "seller"), updateSellerBusiness);

module.exports = router;
