const path = require("path");
const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const productModel = require("./product.model");
const userModel = require("../user/user.model");
const categoryModel = require("../category/category.model");
/**
  GET /products
- GET /products/{id}
- GET /products/categories/{id} --> return all products contain that specific ID
- POST /products
- PUT /products/{id}
- DELETE /products/{id}
 */

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel.find().exec();

  res.status(200).json({
    success: true,
    count: products.length,
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
  const categoryId = req.params.categoryId;

  console.log(categoryId);

  const products = await productModel.find({ category: categoryId });
  const { name, childCat } = await categoryModel.findOne({ _id: categoryId });
  res.status(200).json({
    success: true,
    type: name,
    count: products.length,
    subCategories: childCat,
    data: products,
  });
});

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

exports.getProductsBySellerId = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  const products = await productModel.find({ sellerId });

  console.log(sellerId);
  console.log(products);

  if (products.length === 0) {
    return next(
      new ErrorResponse(400, "Unable to get all products of this seller")
    );
  }

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

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

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { categoryId } = req.params;

  const product = await productModel.findByIdAndUpdate();
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {});

exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.cid);

  if (!category) {
    return next(new ErrorResponse(400, `Product not found`));
  }

  const product = await productModel.findById(req.params.pid);

  if (!product) {
    return next(new ErrorResponse(400, `Product not found`));
  }

  if (!req.files) {
    return next(new ErrorResponse(400, "Please upload a file"));
  }

  console.log("Req.files = ", req.files);

  const file = req.files.file;

  if (
    !file.mimetype.startsWith("image/png") &&
    !file.mimetype.startsWith("image/jpg") &&
    !file.mimetype.startsWith("image/jpeg")
  ) {
    // console.log(file.mimetype.startsWith("image/jpeg"));
    return next(new ErrorResponse(400, "Please upload an image"));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(400, "Please upload a file less than 1MB"));
  }

  file.name = `photo_${product._id}${path.parse(file.name).ext}`;
  console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    console.log(process.env.FILE_UPLOAD_PATH);
    if (err) {
      console.log(err.stack.red);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await productModel.findByIdAndUpdate(
      req.params.pid,
      { image: file.name },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: await productModel.findById(req.params.pid),
    });
  });
});
