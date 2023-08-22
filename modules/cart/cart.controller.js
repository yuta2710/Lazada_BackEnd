const asyncHandler = require("../../middleware/async.middleware");
const cartModel = require("./cart.model");

// /carts/
exports.addCart = asyncHandler(async (req, res, next) => {});

exports.getCarts = asyncHandler(async (req, res, next) => {});
exports.getCart = asyncHandler(async (req, res, next) => {});
exports.updateCart = asyncHandler(async (req, res, next) => {});
exports.deleteCart = asyncHandler(async (req, res, next) => {});
exports.addProductToCart = asyncHandler(async (req, res, next) => {});
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {});
