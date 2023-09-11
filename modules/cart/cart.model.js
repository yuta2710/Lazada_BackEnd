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

CartSchema.pre("save", async function (next) {
  try {
    this.totalPrice = 0;

    for (const container of this.products) {
      const product = await productModel.findById(container.product);
      this.totalPrice += product.price * container.quantity;
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Cart", CartSchema);
