const { default: mongoose, Schema } = require("mongoose");

const OrderSchema = new mongoose.Schema({
  status: {
    type: String,
    unique: true,
    required: [true, "Please add a status"],
    enum: ["new", "accepted", "rejected"],
    default: "new",
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    default: null,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
