const multer = require("multer");
const path = require("path");
const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const productModel = require("./product.model");
const categoryModel = require("../category/category.model");
const fs = require("fs");
const { initMongoId } = require("../../utils/init.util");
const DEFAULT_PATH = "public/uploads/photo_default.png";
const populateConfigurations = require("../../utils/populator.util");
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
  a;
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
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      pId = initMongoId(1)[0];
      const fileName = `photo_${pId}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });

  const upload = multer({ storage: storage }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(500, "File upload failed"));
    }

    const { title, description, price, quantity, categoryId, sellerId, image } =
      req.body;

    console.table({
      title,
      description,
      price,
      quantity,
      categoryId,
      sellerId,
    });

    console.log(req.body);

    console.log("Req.file = ", req.file);
    // console.table()

    const extension = req.file.originalname.split(".").pop();
    const size = req.file.size;
    const fileName = `photo_${pId}${path.extname(req.file.originalname)}`;
    const filePath = `public/uploads/${fileName}`;

    if (extension !== "png" && extension !== "jpeg" && extension !== "jpg") {
      fs.unlinkSync(filePath);
      return next(new ErrorResponse(500, `Please upload an image`));
    }

    if (size > process.env.MAX_FILE_UPLOAD) {
      fs.unlinkSync(filePath);
      return next(new ErrorResponse(400, "Please upload a file less than 1MB"));
    }

    try {
      let newProd;

      const existProd = await productModel.findOne({ title }).exec();

      if (existProd) {
        existProd.quantity += Number(quantity);
        existProd.image = filePath;
        newProd = await existProd.save();
      } else {
        newProd = await productModel.create({
          _id: pId,
          title,
          description,
          price,
          image: filePath,
          quantity: Number(quantity),
          category: categoryId,
          seller: sellerId,
        });
      }

      res.status(200).json({
        success: true,
        message: "Create a new product successfully",
        data: newProd,
      });
    } catch (error) {
      fs.unlinkSync(filePath);
      next(new ErrorResponse(401, "Unable to update this product"));
    }
  });
});

/**
 * @des:     Update a product by ....
 * @route:   PUT /api/v1/products/.....
 * @access:  Private: [Admin]
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // const product = await productModel.findByIdAndUpdate();
  // let pId;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      pId = initMongoId(1)[0];
      const fileName = `photo_${productId}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });

  const upload = multer({ storage: storage }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(500, "File upload failed"));
    }

    const { title, description, price, quantity } = req.body;
    const extension = req.file.originalname.split(".").pop();
    const size = req.file.size;
    const fileName = `photo_${productId}${path.extname(req.file.originalname)}`;
    const filePath = `public/uploads/${fileName}`;

    if (extension !== "png" && extension !== "jpeg" && extension !== "jpg") {
      fs.unlinkSync(filePath);
      return next(new ErrorResponse(500, `Please upload an image`));
    }

    if (size > process.env.MAX_FILE_UPLOAD) {
      fs.unlinkSync(filePath);
      return next(new ErrorResponse(400, "Please upload a file less than 1MB"));
    }

    try {
      const newProd = await productModel.findByIdAndUpdate(
        productId,
        {
          title,
          description,
          price,
          image: filePath,
          quantity,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Updated product successfully",
        data: newProd,
      });
    } catch (error) {
      fs.unlinkSync(filePath);
      next(new ErrorResponse(401, "Unable to update this product"));
    }
  });
});

/**
 * @des:     Delete a new product by ....
 * @route:   DELETE /api/v1/products/.....
 * @access:  Private: [Admin]
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  await productModel.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    message: "Delete item successfully",
    data: {},
  });
});

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
