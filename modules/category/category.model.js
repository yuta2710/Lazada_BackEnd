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
  childCat: {
    type: Array(Schema.Types.ObjectId),
    ref: "Category",
    default: [],
  },
  slug: String,
  products: {
    type: Array(Schema.Types.ObjectId),
    ref: "Product",
    default: [],
  },
});

CategorySchema.pre("save", async function (next) {
  console.log(
    `\n\nInitializing slugify of <${this.name}>....`.yellow.underline.bold
  );
  this.slug = slugify(this.name, { lower: true });
  console.log(`New slug is generated`.green.underline.bold);
  console.table({ name: this.name, slug: this.slug });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
