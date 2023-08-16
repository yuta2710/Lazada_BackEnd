const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const categoryModel = require("./category.model");

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, parentCat, products } = req.body;

  console.table({ name, parentCat, products });

  const category = await categoryModel.create({ name, parentCat, products });

  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find().exec();

  res.status(201).json({
    success: true,
    data: categories,
  });
});
