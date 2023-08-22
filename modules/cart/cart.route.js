const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  addProductToCart,
  getCartByCartId,
  removeProductFromCart,
  deleteCart,
  getCarts,
} = require("./cart.controller");

const router = express.Router();

router.use(protect);
router.use(authorize("customer"));

// router.route("/").get(getAllProducts).post(createProduct);

router.route("/").get(getCarts);
router
  .route("/:cartId")
  .get(getCartByCartId)
  .post(addProductToCart)
  .delete(deleteCart);
router.route("/:cartId/:productId").delete(removeProductFromCart);

module.exports = router;
