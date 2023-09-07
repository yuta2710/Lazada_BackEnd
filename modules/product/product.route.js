const express = require('express')
const router = express.Router()

const {
  createProduct,
  getAllProducts,
  getProductsByCategoryID,
  productPhotoUpload,
  getProductByCategoryAndProductId,
  getProductsBySellerId,
  getProductById
} = require('./product.controller')
const { protect, authorize } = require('../../middleware/auth.middleware')
const dynamicQueryResponse = require('../../middleware/dynamicQueryResponse.middleware')
const productModel = require('./product.model')

router.route('/').get(dynamicQueryResponse(productModel), getAllProducts)
router.route('/:productId').get(protect, authorize('seller'), getProductById)

router
  .route('/sellers/:sellerId')
  .get(protect, authorize('sellers'), getProductsBySellerId)

router
  .route('/categories/:categoryId')
  .get(getProductsByCategoryID)
  .post(protect, authorize('seller'), createProduct)

router
  .route('/categories/:categoryId/:productId')
  .get(protect, authorize('seller'), getProductByCategoryAndProductId)
router.route('/categories/:categoryId/:productId/photo').put(productPhotoUpload)

module.exports = router
