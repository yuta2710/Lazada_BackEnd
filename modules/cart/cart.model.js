const { default: mongoose, Schema } = require("mongoose");

const CartSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    required: [true, "Please add a customer ID"],
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        required: [true, "Please add a product ID"],
        ref: "Product",
      },
      seller: {
        type: Schema.Types.ObjectId,
        required: [true, "Please add a seller ID"],
        ref: "User",
      },
      quantity: {
        type: Number,
        required: [true, "Pleaser add a quantity"],
      },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
