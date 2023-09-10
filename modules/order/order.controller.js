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
 * @access:  Private: [seller]
 */
exports.getAllOrdersByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.user;

  console.log(role);

  let orders;

  // customer: display only order's products info
  if (role === "customer") {
    console.log();
    // Get all orders associated with the userId of the logged-in customer
    orders = await orderModel
      .find({ customer: userId })
      .select("-customer")
      .populate(["products", "products.product"]);

    console.log(orders);
  }
  // Seller: display all of orders info
  if (role === "seller") {
    // Get all orders associated with the specified sellerId
    const products = await productModel.find({ seller: userId });
    const productIds = products.map((prod) => prod._id);

    orders = await orderModel
      .find({
        "products.product": { $in: productIds },
      })
      .populate(["customer", "products", "products.product"]);
  }

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
  const { customerId, totalPrice } = req.body;

  let order;
  if (req.user) {
    const user = await userModel.findById(customerId);

    console.log(user);
    const cart = await cartModel.findById(user.cart);

    order = await orderModel.create({
      customer: customerId,
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
  const { orderId, productId } = req.params;
  const { status } = req.body;
  const { role } = req.user;
  const validStatusValues = [
    "new",
    "shipped",
    "cancelled",
    "accepted",
    "rejected",
  ];
  let order;
  let finalStatus;

  order = await orderModel.findById(orderId);

  if (order) {
    if (!validStatusValues.includes(status)) {
      return next(new ErrorResponse(400, "Invalid status"));
    } else {
      if (role === "seller") {
        if (
          status === validStatusValues[1] ||
          status === validStatusValues[2]
        ) {
          finalStatus = status;
          const prodIndex = order.products.findIndex(
            (product) => product.product.toString() === productId
          );
          if (order.products[prodIndex].status !== validStatusValues[0]) {
            return next(
              new ErrorResponse(
                400,
                "Only update this status if pre-status is 'new'"
              )
            );
          } else {
            order.products[prodIndex].status = status;
          }
        } else {
          return next(
            new ErrorResponse(
              400,
              "User role <Seller> only choose 'Shipped' or 'Cancelled'"
            )
          );
        }
      }

      if (role === "customer") {
        if (
          status === validStatusValues[3] ||
          status === validStatusValues[4]
        ) {
          finalStatus = status;
          const prodIndex = order.products.findIndex(
            (product) => product.product.toString() === productId
          );

          if (
            order.products[prodIndex].status !== validStatusValues[0] &&
            order.products[prodIndex].status !== validStatusValues[1]
          ) {
            return next(
              new ErrorResponse(
                400,
                "Only update this status if pre-status is 'new'"
              )
            );
          } else {
            if (order.products[prodIndex].status === validStatusValues[1]) {
              order.products[prodIndex].status = status;
            } else {
              return next(
                new ErrorResponse(
                  400,
                  "Customer only accept or reject if a seller marked the product's state as 'shipped'"
                )
              );
            }
          }
        } else {
          return next(
            new ErrorResponse(
              400,
              "User role <Customer> only choose 'Accept' or 'Reject'"
            )
          );
        }
      }
    }
  } else {
    return next(new ErrorResponse(400, "Order not found"));
  }

  await order.save();

  const orderIndex = order.products.findIndex((orderId) =>
    orderId.equals(order._id)
  );

  if (orderIndex !== -1) {
    req.user.order[orderIndex].status = status;
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Update order status successfully",
    data: order,
  });
});
