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
} = require("./product.controller");

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/categories/:cid").get(getProductsCategory);
router.route("/categories/:cid/:pid").get(getProductByCategoryAndProductId);
router.route("/categories/:cid/:pid/photo").put(productPhotoUpload);

module.exports = router;
