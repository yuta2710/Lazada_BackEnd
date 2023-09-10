const { default: mongoose, Schema } = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
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
        enum: ["new", "shipped", "accepted", "rejected", "cancelled"],
        default: "new",
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

module.exports = mongoose.model("Order", OrderSchema);
