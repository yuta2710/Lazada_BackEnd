const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../middleware/async.middleware");
const categoryModel = require("./category.model");
const ErrorResponse = require("../../utils/error.util");

/**
 * @des:     Get all of categories
 * @route:   GET /api/v1/categories
 * @access:  Private: [Admin]
 */
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.dynamicQueryResponse);
});

/**
 * @des:     Get a specific category by any category ID
 * @route:   GET /api/v1/categories/:id
 * @access:  Private: [Admin]
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);

  console.log(category);
  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @des:     Get all sub categories by parent category ID
 * @route:   GET /api/v1/categories/:parentId/subCategories
 * @access:  Private: [Admin]
 */
exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  const { parentId } = req.params;
  const category = await categoryModel.findById(parentId);

  res.status(200).json({
    success: true,
    parentCat: parentId,
    data: category.childCat,
  });
});

/**
 * @des:     Create a main category
 * @route:   POST /api/v1/categories
 * @access:  Private: [Admin]
 */
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

/**
 * @des:     Create a sub category by parent category ID
 * @route:   POST /api/v1/categories/:parentId/subCategories
 * @access:  Private: [Admin]
 */
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

/**
 * @des:     Update a specific category by any category ID
 * @route:   PUT /api/v1/categories/:id
 * @access:  Private: [Admin]
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .exec();
  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @des:     Remove a specific category by any category ID
 * @route:   DELETE /api/v1/categories/:id
 * @access:  Private: [Admin]
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  await categoryModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @des:     Remove a sub category by the parent and sub categories ID
 * @route:   DELETE /api/v1/categories/:parentId/subCategories/:subCategoryId
 * @access:  Private: [Admin]
 */
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
