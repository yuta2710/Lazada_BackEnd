const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("../user/user.model");
const cartModel = require("../cart/cart.model");
const productModel = require("../product/product.model");
const orderModel = require("../order/order.model");
const ErrorResponse = require("../../utils/error.util");

/**
 * @des:     Get all of orders
 * @route:   GET /api/v1/orders
 * @access:  Private: [Admin]
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find().exec();

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @des:     Get all of orders by seller ID
 * @route:   GET /api/v1/orders
 * @access:  Private: [Admin]
 */
exports.getAllOrdersBySellerId = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;

  const products = await productModel.find({ seller: sellerId });

  const productIds = products.map((prod) => prod._id);
  const orders = await orderModel
    .find({
      "products.product": { $in: productIds },
    })
    .populate("customer");

  res.status(200).json({
    success: true,
    data: orders,
  });
});

/**
 * @des:     Create a new order
 * @route:   POST /api/v1/orders
 * @access:  Private: [All]
 */
// status: neu status new, customer ko lam dc gi, seller change ship[ top cancel]
// if status shipped, customer accept or rejected, 1 khoi accept hoac rejected,
// status canceled, 2 thg lp d change status
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { customerId, products, totalPrice } = req.body;

  let order;
  if (req.user) {
    const user = await userModel.findById(customerId);

    console.log(user);
    const cart = await cartModel.findById(user.cart);

    order = await orderModel.create({
      customer: customerId,
      products: products,
      totalPrice: totalPrice,
    });

    for (let i = 0; i < cart.products.length; i++) {
      cart.products[i].status = "new";
      order.products.push(cart.products[i]);
      let currProduct = await productModel.findById(cart.products[i].product);
      if (currProduct.quantity >= cart.products[i].quantity) {
        currProduct.quantity -= cart.products[i].quantity;
        await currProduct.save();
      } else {
        return next(
          new ErrorResponse(
            400,
            "The require quantity cannot greater than the product's current quantity"
          )
        );
      }
    }

    await order.save();
    user.order = order._id;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Create new order successfully",
    data: order,
  });
});

/**
 * @des:     Update an order's status
 * @route:   POST /api/v1/orders
 * @access:  Private: [All]
 */
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatusValues = ["new", "accepted", "rejected"];
  let order;

  order = await orderModel.findById(orderId);

  if (order) {
    if (!validStatusValues.includes(status)) {
      return next(
        new ErrorResponse(400, "Status must be <Accepted> or <Rejected>")
      );
    }
    if (order.status === validStatusValues[0]) {
      order = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
    } else {
      return next(
        new ErrorResponse(
          400,
          "Unable to update order with status <Accepted> or <Rejected>"
        )
      );
    }
  } else {
    return next(new ErrorResponse(400, "Order not found"));
  }

  res.status(200).json({
    success: true,
    message: "Update order status successfully",
    data: order,
  });
});
