const path = require("path");
const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const productModel = require("./product.model");
const userModel = require("../user/user.model");
/**
  GET /products
- GET /products/{id}
- GET /products/categories/{id} --> return all products contain that specific ID
- POST /products
- PUT /products/{id}
- DELETE /products/{id}
 */

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel.find();

  res.status(200).json({
    success: true,
    data: products,
  });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id).exec();

  res.status(200).json({
    success: true,
    data: product,
  });
});
exports.getProductsCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const products = await productModel.find({ category: categoryId });

  res.status(200).json({
    success: true,
    data: products,
  });
});
exports.getProductsByPrice = asyncHandler(async (req, res, next) => {});
exports.getProductsByDateAdded = asyncHandler(async (req, res, next) => {});

exports.getProductByName = asyncHandler(async (req, res, next) => {});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, image, dateAdded, category, quantity } =
    req.body;

  const product = await productModel.create({
    title,
    description,
    price,
    image,
    dateAdded,
    category,
    quantity,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {});
exports.deleteProduct = asyncHandler(async (req, res, next) => {});

exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(400, `Product not found`));
  }

  if (!req.files) {
    return next(new Response(400, "Please upload a file"));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(400, "Please upload an image"));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(400, "Please upload a file less than 1MB"));
  }

  file.name = `photo_${product._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await productModel.findByIdAndUpdate(
      req.params.id,
      { image: file.name },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: await userModel.findById(req.params.id),
    });
  });
});
