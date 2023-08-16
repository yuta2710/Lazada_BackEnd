const asyncHandler = require("../../middleware/async.middleware");
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

  res.status(200).json({
    success: true,
    data: categories,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id).exec();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .exec();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  await categoryModel.findByIdAndDelete(req.params.id).exec();

  res.status(200).json({
    success: true,
    data: {},
  });
});
