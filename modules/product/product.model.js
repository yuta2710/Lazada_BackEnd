const { default: mongoose, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  image: {
    type: String,
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
  console.log(
    `\n\nInitializing slugify of <${this.title}>....`.yellow.underline.bold
  );
  this.slug = slugify(this.title, { lower: true });
  console.log(`New slug is generated`.green.underline.bold);
  console.table({ title: this.title, slug: this.slug });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
