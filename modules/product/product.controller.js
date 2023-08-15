const asyncHandler = require("../../middleware/async.middleware");

exports.getAllProducts = asyncHandler(async (req, res, next) => {});

exports.getProductsByCategory = asyncHandler(async (req, res, next) => {});
exports.getProductsBySubCategories = asyncHandler(async (req, res, next) => {});
exports.getProductsByPrice = asyncHandler(async (req, res, next) => {});
exports.getProductsByDateAdded = asyncHandler(async (req, res, next) => {});

exports.getProductById = asyncHandler(async (req, res, next) => {});
exports.getProductByName = asyncHandler(async (req, res, next) => {});

exports.createProduct = asyncHandler(async (req, res, next) => {});
exports.updateProduct = asyncHandler(async (req, res, next) => {});
exports.deleteProduct = asyncHandler(async (req, res, next) => {});
