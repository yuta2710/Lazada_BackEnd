const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  addProductToCart,
  getCartById,
  removeProductFromCart,
  deleteCart,
  getCarts,
} = require("./cart.controller");

const router = express.Router();
const dynamicQueryResponse = require("../../middleware/dynamicQueryResponse.middleware");
const cartModel = require("./cart.model");
const { populateConfigurations } = require("../../utils/populator.util");

// router.route("/").get(getAllProducts).post(createProduct);

router
  .route("/")
  .get(
    protect,
    authorize("admin"),
    dynamicQueryResponse(cartModel, populateConfigurations.path.cart),
    getCarts
  )
  .post(addProductToCart);
// .post(protect, authorize("admin", "seller", "customer"), addProductToCart);
router.route("/:cartId").get(protect, getCartById).delete(protect, deleteCart);
router.route("/:cartId/:productId").delete(protect, removeProductFromCart);

module.exports = router;
