const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("../user/user.model");
const cartModel = require("../cart/cart.model");
const productModel = require("../product/product.model");
const orderModel = require("../order/order.model");
const ErrorResponse = require("../../utils/error.util");

exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find().exec();

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// exports.getMeOrder = asyncHandler(async (req, res, next) => {
//   const user = await userModel.find(req.user._id);

//   let order;
//   if (user) {
//     order = await orderModel.findById(user.order).exec();
//   }

//   res.status(200).json({
//     success: true,
//     count: orders.length,
//     data: orders,
//   });
// });

exports.createOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);

  if (!user || user.role !== "customer" || !user.cart) {
    return next(new ErrorResponse(400, "No valid cart found for the user"));
  }

  const cart = await cartModel.findById(cartId);

  let order;

  if (cart.products.length === 0) {
    return next(
      new ErrorResponse(400, "Cannot create order with empty products")
    );
  }

  order = await orderModel.create({
    cartId: user.cart,
    products: cart.products,
  });

  user.order = order._id;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Create new order successfully",
    data: order,
  });
});

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
