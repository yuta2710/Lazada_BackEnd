const { default: mongoose, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

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
  childCat: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: [],
    },
  ],
  slug: String,
  products: {
    type: Array(Schema.Types.ObjectId),
    ref: "Product",
    default: [],
  },
});

CategorySchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
