const { default: mongoose, Schema } = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please add a title"],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
