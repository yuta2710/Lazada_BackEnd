const { default: mongoose, Schema } = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please add a title"],
  },
  parentCat: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  products: {
    type: Array(Schema.Types.ObjectId),
    ref: "Product",
    default: [],
  },
});

module.exports = mongoose.model("Category", CategorySchema);
