const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async.middleware");
const categoryModel = require("./category.model");

exports.createMainCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  console.table({ name });

  const category = await categoryModel.create({
    name,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { parentId } = req.params;

  console.table({ name, parentId });

  const newSubCategory = await categoryModel.create({
    name,
    parentCat: parentId,
  });
  const parentCategory = await categoryModel.findById(parentId);

  if (parentCategory) {
    parentCategory.childCat.push(newSubCategory._id);
    await parentCategory.save();
  }

  res.status(201).json({
    success: true,
    data: newSubCategory,
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
  const category = await categoryModel.findById(req.params.id);

  console.log(category);
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
