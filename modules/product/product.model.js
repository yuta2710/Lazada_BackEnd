const { default: mongoose, Schema } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    // unique: true,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  image: {
    type: String,
    default: "no-photo.jpg",
    required: [true, "Please select a photo"],
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: [true, "Please add a quantity"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
