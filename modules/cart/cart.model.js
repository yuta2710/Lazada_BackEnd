const { default: mongoose, Schema } = require("mongoose");

const CartSchema = new mongoose.Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please add a customer ID"],
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: [true, "Please add a product ID"],
        ref: "Product",
      },
      sellerId: {
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
