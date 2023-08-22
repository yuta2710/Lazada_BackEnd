const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const { addProductToCart, getCartByUserId } = require("./cart.controller");

const router = express.Router();

router.use(protect);
router.use(authorize("customer"));

// router.route("/").get(getAllProducts).post(createProduct);

router.route("/:id").get(getCartByUserId).post(addProductToCart);

// router
//   .route("/:id")
//   .get(getProductById)
//   .put(updateProduct)
//   .delete(deleteProduct);

// router.route("/categories/:cid").get(getProductsCategory);
// router.route("/categories/:cid/:pid").get(getProductByCategoryAndProductId);
// router.route("/categories/:cid/:pid/photo").put(productPhotoUpload);

module.exports = router;
