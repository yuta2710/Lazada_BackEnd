const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async.middleware");
const categoryModel = require("./category.model");
const ErrorResponse = require("../../utils/error.util");

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.dynamicQueryResponse);
});
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

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);

  console.log(category);
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  const { parentId } = req.params;
  const category = await categoryModel.findById(parentId);

  res.status(200).json({
    success: true,
    parentCat: parentId,
    data: category.childCat,
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
  await categoryModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { parentId, subCategoryId } = req.params;

  if (!(await categoryModel.findById(subCategoryId))) {
    return next(new ErrorResponse(400, "Sub-category not found"));
  } else {
    await categoryModel.findByIdAndDelete(subCategoryId);
  }

  const parentCat = await categoryModel.findById(parentId);

  if (parentCat) {
    const existSubCatIndex = parentCat.childCat.findIndex(
      (prod) => prod._id.toString() === subCategoryId
    );

    if (existSubCatIndex != -1) {
      parentCat.childCat.splice(existSubCatIndex, 1);
    }

    await parentCat.save();
    res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    return next(new ErrorResponse(400, "Parent cat not found"));
  }
});
