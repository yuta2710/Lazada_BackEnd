const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsCategory,
  productPhotoUpload,
  getProductByCategoryAndProductId,
  getProductsBySellerId,
} = require("./product.controller");
const { protect, authorize } = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getAllProducts);

router.route("/sellers/:sellerId").get(getProductsBySellerId);

router
  .route("/categories/:categoryId")
  .get(getProductsCategory)
  .post(createProduct);
router
  .route("/categories/:categoryId/:productId")
  .get(getProductByCategoryAndProductId);
router
  .route("/categories/:categoryId/:productId/photo")
  .put(productPhotoUpload);

module.exports = router;
