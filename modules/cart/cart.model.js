const { default: mongoose, Schema } = require("mongoose");
const productModel = require("../product/product.model");

const CartSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        required: [true, "Please add a product ID"],
        ref: "Product",
      },
      status: {
        type: String,
        enum: ["new", "shipped", "accepted", "rejected", "canceled", ""],
        default: "",
      },
      quantity: {
        type: Number,
        required: [true, "Pleaser add a quantity"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

// customer not login ==> save to local storage
// login ==> send that cart from local storage to database
// after that, customer will create order
// inside that create order, that seller can list of orders
// seller need to decide

// accept, reject from customer

// If shipped, seller's product size less than required quantity ==> prevent "shipped"
// After shipped, customer selected accept, the product in that seller will minus the quantity they shipped.

CartSchema.pre("save", async function (next) {
  try {
    // Initialize totalPrice to 0
    this.totalPrice = 0;

    // Iterate through each product in the cart
    for (const container of this.products) {
      // Find the product by its ID
      const product = await productModel.findById(container.product);

      // Add the product's price multiplied by quantity to totalPrice
      this.totalPrice += product.price * container.quantity;
    }

    next(); // Move to the next middleware or save the document
  } catch (error) {
    next(error); // Pass any errors to the next middleware or error handler
  }
});

module.exports = mongoose.model("Cart", CartSchema);
