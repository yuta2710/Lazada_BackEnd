const path = require("path");
const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const productModel = require("./product.model");
const userModel = require("../user/user.model");
const categoryModel = require("../category/category.model");
const upload = require("../../middleware/upload.middleware");

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
  const product = await productModel.findById(req.params.id).exec();

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
  const products = await productModel.find({ category: categoryId });
  const { name, childCat } = await categoryModel.findOne({ _id: categoryId });
  const productsOfSubCategories = {};

  for (let i = 0; i < childCat.length; i++) {
    const childId = childCat[i];
    const products = await productModel.find({ category: childId });
    productsOfSubCategories[childId] = products;
  }
  res.status(200).json({
    success: true,
    type: name,
    count: products.length,
    subCategories: productsOfSubCategories,
    data: products,
  });
});

// exports.getProductsByCategoryName = asyncHandler(async (req, res, next) => {
//   const catName = req.params.name;

//   console.log(catName);

//   const category = await categoryModel.find();

//   console.log(category);

//   // console.log(category);

//   if (!category) {
//     return next(new ErrorResponse(404, `Category ${catName} not found`));
//   }

//   const products = await productModel.find({ category: category._id });

//   if (products.length === 0) {
//     return next(
//       new ErrorResponse(
//         404,
//         `All products with category <${category._id}> not found`
//       )
//     );
//   }

//   const { name, childCat } = await categoryModel.findOne({ _id: categoryId });

//   res.status(200).json({
//     success: true,
//     type: name,
//     count: products.length,
//     // subCategories: await categoryModel.findById({ _id: childCat }).exec().name,
//     data: products,
//   });
// });

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
  const products = await productModel.find({ sellerId });

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

  console.log("Req.files = ", req.files);
  console.log(file);

  // if (
  //   !file.mimetype.startsWith("image/png") &&
  //   !file.mimetype.startsWith("image/jpg") &&
  //   !file.mimetype.startsWith("image/jpeg")
  // ) {
  //   // console.log(file.mimetype.startsWith("image/jpeg"));
  //   return next(new ErrorResponse(400, "Please upload an image"));
  // }

  // if (file.size > process.env.MAX_FILE_UPLOAD) {
  //   return next(new ErrorResponse(400, "Please upload a file less than 1MB"));
  // }

  // file.name = `photo_${product._id}${path.parse(file.name).ext}`;
  // console.log(file.name);

  // file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
  //   console.log(process.env.FILE_UPLOAD_PATH);
  //   if (err) {
  //     console.log(err.stack.red);
  //     return next(new ErrorResponse("Problem with file upload", 500));
  //   }

  //   await productModel.findByIdAndUpdate(
  //     req.params.pid,
  //     { image: file.name },
  //     { new: true }
  //   );

  //   res.status(200).json({
  //     success: true,
  //     data: await productModel.findById(req.params.pid),
  //   });
  // });
});
