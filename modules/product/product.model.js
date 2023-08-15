const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    unique: true,
    required: [true, "Please add a description"],
  },
  price: {
    type: Double,
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
    required: [true, "Please add a date added"],
  },
  quantity: {
    type: Number,
    required: [true, "Please add a quantity"],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
