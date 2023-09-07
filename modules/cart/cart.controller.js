const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("../user/user.model");
const cartModel = require("./cart.model");
const productModel = require("../product/product.model");

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
    const cart = await cartModel.findById(cartId);

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
  const { cartId } = req.params;
  const product = await productModel.findOne({ title });

  if (product) {
    let user = await userModel.findById(req.user._id);
    if (user && user.role === "customer") {
      if (!user.cart) {
        const newCart = await cartModel.create({
          customer: user._id,
          seller: product.seller,
        });

        console.log(newCart);

        user.cart = newCart._id;
        await user.save();
      } else {
        const cart = await cartModel.findById(cartId);
        const existProdIndex = cart.products.findIndex((prod) =>
          prod.product.equals(product._id)
        );

        console.log(existProdIndex);
        if (existProdIndex != -1) {
          cart.products[existProdIndex].quantity += quantity;
        } else {
          cart.products.push({
            product: product._id,
            quantity,
            seller: product.seller,
          });
        }
        await cart.save();
      }
    } else {
      res.status(400).json({
        success: false,
        message: "UserId cannot be empty",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Add product to a cart successfully",
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
    if (user && user.role === "customer") {
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
        message: "Not authorize to access this route",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Add product to a cart successfully",
    data: await cartModel.findById(await userModel.findById(req.user._id).cart),
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
