const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("../user/user.model");
const cartModel = require("./cart.model");
const productModel = require("../product/product.model");
const { populateConfigurations } = require("../../utils/populator.util");
const { initMongoId } = require("../../utils/init.util");
const { extractUserIdFromToken } = require("../../utils/token.util");
const { convertToMongoIdFormat } = require("../../utils/convert.util");
const ErrorResponse = require("../../utils/error.util");

/**
 * @des:     Get all of carts
 * @route:   GET /api/v1/carts
 * @access:  Private: [Admin]
 */
exports.getCarts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.dynamicQueryResponse);
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
  const { title, quantity } = req.body;
  const product = await productModel.findOne({ title });
  let newCart;

  // If product was exist
  if (product) {
    // If the user was logged-in
    if (req.cookies.token) {
      const strId = extractUserIdFromToken(req.cookies.token);
      const user = await userModel.findById(strId);

      // If cart of that customer was pre-exist
      if (user.cart) {
        const cart = await cartModel.findById(user.cart);

        const existProdIndex = cart.products.findIndex((prod) =>
          prod.product.equals(product._id)
        );

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
          cart.products.push({ product: product._id, quantity });
          await cart.save();
        }
      } else {
        // If user was logged-in, but not have a cart ==> create it
        newCart = await cartModel.create({
          _id: initMongoId(1)[0],
          customer: user._id,
        });
        newCart.products.push({ product: product._id, quantity });
        user.cart = newCart._id;
        await newCart.save();
        await user.save();
      }
    } else {
      // If user's role is a guest
      if (newCart !== undefined) {
        // If the newCart of that guest was exist
        const cart = await cartModel.findById(newCart._id);

        if (cart !== null) {
          const existProdIndex = cart.products.findIndex((prod) =>
            prod.product.equals(product._id)
          );
          if (existProdIndex != -1) {
            if (quantity < product.quantity) {
              cart.products[existProdIndex].quantity += Number(quantity);
              await cart.save();
            }
          }
        }
      } else {
        newCart = await cartModel.create({
          _id: initMongoId(1)[0],
        });
        newCart.products.push({ product: product._id, quantity });
        await newCart.save();
      }
    }
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
 * @access:  Private: [Admin, Customer]
 */
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { cartId, productId } = req.params;
  const product = await productModel.findById(productId);

  console.log(product);

  if (product) {
    let user = await userModel.findById(req.user._id);
    const cart = await cartModel.findOne({ _id: cartId });
    console.log(cart);

    const existProdIndex = cart.products.findIndex((prod) =>
      prod.product.equals(product._id)
    );

    if (existProdIndex != -1) {
      cart.products.splice(existProdIndex, 1);
    }
    await cart.save();
  } else {
    res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Remove product to a cart successfully",
    data: await cartModel.findById(cartId),
  });
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
