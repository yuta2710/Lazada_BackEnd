const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  addProductToCart,
  getCartById,
  removeProductFromCart,
  getCarts,
  cleanAllProductsInCart,
} = require("./cart.controller");

const router = express.Router();
const dynamicQueryResponse = require("../../middleware/dynamicQueryResponse.middleware");
const cartModel = require("./cart.model");
const { populateConfigurations } = require("../../utils/populator.util");

router
  .route("/")
  .get(
    protect,
    authorize("admin"),
    dynamicQueryResponse(cartModel, populateConfigurations.path.cart),
    getCarts
  )
  .post(protect, addProductToCart);
router.route("/:cartId").get(protect, getCartById);
router.route("/:cartId/:productId").delete(protect, removeProductFromCart);
router.route("/:cartId/clean").get(protect, cleanAllProductsInCart);

module.exports = router;
