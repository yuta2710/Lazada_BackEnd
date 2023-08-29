const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductsCategory,
  productPhotoUpload,
  getProductByCategoryAndProductId,
  getProductsBySellerId,
} = require("./product.controller");
const upload = require("../../middleware/upload.middleware");
const { protect, authorize } = require("../../middleware/auth.middleware");
const dynamicQueryResponse = require("../../middleware/dynamicQueryResponse.middleware");
const productModel = require("./product.model");

router.use(protect);
router.use(authorize("admin"));
// router.use(upload.single("image"));

router.route("/").get(dynamicQueryResponse(productModel), getAllProducts);

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
