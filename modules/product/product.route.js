const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsCategory,
  productPhotoUpload,
} = require("./product.controller");

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/categories/:id").get(getProductsCategory);
router.route("/categories/:id/photo").put(productPhotoUpload);

module.exports = router;
