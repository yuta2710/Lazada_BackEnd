const { default: mongoose, Schema } = require("mongoose");

const OrderSchema = new mongoose.Schema({
  status: {
    type: String,
    unique: true,
    enum: ["New", "Accepted", "Rejected"],
    default: "New",
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    default: null,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
