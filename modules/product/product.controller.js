const path = require("path");
const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const productModel = require("./product.model");
const userModel = require("../user/user.model");
const categoryModel = require("../category/category.model");
const upload = require("../../middleware/upload.middleware");
const fs = require("fs");

/**
 * @des:     Get all of products
 * @route:   GET /api/v1/products
 * @access:  Private: [Admin]
 */
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.dynamicQueryResponse);
});

/**
 * @des:     Get a product by ID
 * @route:   GET /api/v1/products/:productId
 * @access:  Private: [Admin]
 */
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.productId).exec();

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @des:     Get all products by category ID
 * @route:   GET /api/v1/products/categories/:categoryId
 * @access:  Private: [Admin]
 */
exports.getProductsByCategoryID = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.categoryId;

  const category = await categoryModel
    .findOne({ _id: categoryId })
    .populate("childCat");

  const products = await productModel.find({ category: categoryId });

  const productsOfSubCategories = {};

  for (let i = 0; i < category.childCat.length; i++) {
    const childId = category.childCat[i]._id;
    const childCategory = category.childCat[i].name;
    const childProducts = await productModel.find({ category: childId });

    productsOfSubCategories[childCategory] = childProducts;
  }

  res.status(200).json({
    success: true,
    type: category.name,
    count: products.length,
    subCategories: productsOfSubCategories,
    data: products,
  });
});

/**
 * @des:     Get a product by category and ID
 * @route:   GET /api/v1/products/categories/:categoryId/:productId
 * @access:  Private: [Admin]
 */
exports.getProductByCategoryAndProductId = asyncHandler(
  async (req, res, next) => {
    const catId = req.params.categoryId;
    const prodId = req.params.productId;

    const { name } = await categoryModel.findOne({ _id: catId });
    const product = await productModel.find({ _id: prodId, category: catId });

    res.status(200).json({
      success: true,
      type: name,
      data: product,
    });
  }
);

/**
 * @des:     Get all product by a seller ID
 * @route:   GET /api/v1/products/sellers/:sellerId
 * @access:  Private: [Admin]
 */
exports.getProductsBySellerId = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  const products = await productModel.find({ seller: sellerId });

  if (products.length === 0) {
    return next(
      new ErrorResponse(
        400,
        `Unable to get all products of this seller <${sellerId}>`
      )
    );
  }

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * @des:     Create a new product by category ID
 * @route:   POST /api/v1/products/categories/:categoryId
 * @access:  Private: [Admin]
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, image, quantity } = req.body;
  const { categoryId } = req.params;

  let product;

  product = await productModel.findOne({ title });

  console.log(product);

  if (product) {
    // If product exists, update its quantity
    product.quantity += quantity;
    await product.save();
  }
  // If product doesn't exist, create a new one
  else {
    if (categoryId) {
      product = await productModel.create({
        title,
        description,
        price,
        image,
        category: categoryId,
        quantity,
      });
    } else {
      product = await productModel.create({
        title,
        description,
        price,
        image,
        quantity,
      });
    }

    const category = await categoryModel.findById(categoryId);

    if (category) {
      category.products.push(product._id);

      await category.save();
    }
  }

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @des:     Update a product by ....
 * @route:   PUT /api/v1/products/.....
 * @access:  Private: [Admin]
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { categoryId } = req.params;

  const product = await productModel.findByIdAndUpdate();
});

/**
 * @des:     Delete a new product by ....
 * @route:   DELETE /api/v1/products/.....
 * @access:  Private: [Admin]
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {});

/**
 * @des:     Upload a new photo of product by category and product ID
 * @route:   PUT /api/v1/products/categories/:categoryId/:productId/photo
 * @access:  Private: [Admin]
 */
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const { categoryId, productId } = req.params;
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    return next(new ErrorResponse(400, `Category not found`));
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return next(new ErrorResponse(400, `Product not found`));
  }

  // Process image uploading
  upload.single("image")(req, res, async (err) => {
    const extension = req.file.originalname.split(".").pop();
    const size = req.file.size;

    if (extension !== "png" && extension !== "jpeg" && extension !== "jpg") {
      // Prevent save the image to the folder
      fs.unlinkSync(req.file.path);
      return next(new ErrorResponse(500, `Please upload an image`));
    }

    if (size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(400, "Please upload a file less than 1MB"));
    }

    product.image = req.file.path;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Upload photo successfully",
      data: product,
    });
  });
});
