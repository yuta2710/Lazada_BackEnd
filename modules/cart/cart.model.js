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
        required: true,
        ref: "Product",
      },
      sellerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
