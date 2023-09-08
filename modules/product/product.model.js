const { default: mongoose, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  image: {
    type: String,
    default: null,
  },
  slug: String,
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
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

ProductSchema.pre("save", async function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
