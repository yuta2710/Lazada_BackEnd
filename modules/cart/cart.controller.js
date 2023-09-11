const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("../user/user.model");
const cartModel = require("./cart.model");
const productModel = require("../product/product.model");
const { populateConfigurations } = require("../../utils/populator.util");
const { initMongoId } = require("../../utils/init.util");
const { extractUserIdFromToken } = require("../../utils/token.util");
const { convertToMongoIdFormat } = require("../../utils/convert.util");
const ErrorResponse = require("../../utils/error.util");
const orderModel = require("../order/order.model");

/**
 * @des:     Get all of carts
 * @route:   GET /api/v1/carts
 * @access:  Private: [Admin]
 */
exports.getCarts = asyncHandler(async (req, res, next) => {
  const carts = await cartModel.find();
  res.status(200).json({
    success: true,
    data: carts,
  });
});

/**
 * @des:     Get a specific cart by ID
 * @route:   GET /api/v1/carts/:cartId
 * @access:  Private: [Admin]
 */
exports.getCartById = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const { cartId } = req.params;
  if (req.user) {
    const cart = await cartModel
      .findById(cartId)
      .populate(populateConfigurations.path.cart);

    if (cart) {
      res.status(200).json({
        success: true,
        data: cart,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Cart does not exist to view",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User not exist to view cart",
    });
  }
});

/**
 * @des:     Add a product to the current cart
 * @route:   POST /api/v1/carts/:cartId
 * @access:  Private: [Admin, Customer]
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  console.log("hello")
  if (quantity > product.quantity) {
    return next(
      new ErrorResponse(
        400,
        "The required quantity cannot be greater than the product's current quantity"
      )
    );
  }

  let newCart;
  // If product was exist
  if (product) {
    // If the user was logged-in
    if (req.headers.authorization.split(" ")[1]) {
      const strId = extractUserIdFromToken(req.headers.authorization.split(" ")[1]);
      const user = await userModel.findById(strId);
      console.log(user.cart)
      // If cart of that customer was pre-exist
      if (user.cart) {
        const cart = await cartModel.findById(user.cart);

        const existProdIndex = cart.products.findIndex((prod) =>
          prod.product.equals(product._id)
        );

        // If the product exist in that cart before
        if (existProdIndex != -1) {
          // If the required quantity is less than the product's current quantity
          if (quantity < product.quantity) {
            cart.products[existProdIndex].quantity += Number(quantity); // update the quantity of product in cart
            await cart.save();
          } else {
            return next(
              new ErrorResponse(
                400,
                "The required quantity cannot be greater than the product's current quantity"
              )
            );
          }
        } else {
          // If the cart does not contain that product, push to the cart
          cart.products.push({
            product: product._id,
            quantity,
          });
          await cart.save();
        }
      } else {
        // If user was logged-in, but not have a cart ==> create it
        newCart = await cartModel.create({
          _id: initMongoId(1)[0],
          customer: user._id,
        });
        newCart.products.push({
          product: product._id,
          quantity,
        });
        user.cart = newCart._id;
        await newCart.save();
        await user.save();
      }
    }
  } else {
    return next(new ErrorResponse(404, "Product not found"));
  }
  res.status(200).json({
    success: true,
    message: "Add product to a cart successfully",
    data: newCart,
  });
});

/**
 * @des:     Remove a product from the current cart
 * @route:   Delete /api/v1/carts/:cartId/:productId
 * @access:  Public: []
 */
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { cartId, productId } = req.params;
  const product = await productModel.findById(productId);
  console.log(product)
  // If the product was exist in database, check user login state
  if (product) {
    if (req.headers.authorization.split(" ")[1]) {
      const cart = await cartModel.findById(cartId);

      if (cart !== null) {
        const existProdIndex = cart.products.findIndex((prod) =>
          prod.product.equals(product._id)
        );

        // If the product was exist in the cart
        if (existProdIndex != -1) {
          cart.products.splice(existProdIndex, 1); // Remove that product from cart
        } else {
          return next(
            new ErrorResponse(404, "Product not exist in your cart to remove")
          );
        }
        await cart.save(); // Save to hold the persistence of data
      } else {
        return next(new ErrorResponse(404, "Cart not found"));
      }
    } else {
      return next(404, "Unauthorized to remove this product from cart");
    }
    res.status(200).json({
      success: true,
      message: "Remove product to a cart successfully",
      data: await cartModel.findById(cartId),
    });
  } else {
    return next(new ErrorResponse(404, "Product not found"));
  }
});

/**
 * @des:     Update a current cart by ID
 * @route:   PUT /api/v1/carts/:cartId
 * @access:  Private: [Admin]
 */
exports.updateCart = asyncHandler(async (req, res, next) => {});

/**
 * @des:     Remove a current cart by ID
 * @route:   DELETE /api/v1/carts/:cartId
 * @access:  Private: [Admin]
 */
exports.deleteCart = asyncHandler(async (req, res, next) => {});
