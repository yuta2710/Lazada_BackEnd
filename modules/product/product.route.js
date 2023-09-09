const express = require('express')
const router = express.Router()

const {
  createProduct,
  getAllProducts,
  getProductsByCategoryID,
  productPhotoUpload,
  getProductByCategoryAndProductId,
  getProductsBySellerId,
  getProductById,
  productPhotoUploadTmp
} = require('./product.controller')
const { protect, authorize } = require('../../middleware/auth.middleware')
const dynamicQueryResponse = require('../../middleware/dynamicQueryResponse.middleware')
const productModel = require('./product.model')
const { populateConfigurations } = require('../../utils/populator.util')

router
  .route('/')
  .get(
    dynamicQueryResponse(productModel, populateConfigurations.path.product),
    getAllProducts
  )
router.route('/:productId').get(getProductById)

router
  .route('/sellers/:sellerId')
  .get(protect, authorize('seller'), getProductsBySellerId)

router
  .route('/categories/:categoryId')
  .get(getProductsByCategoryID)
  .post(protect, authorize('seller'), createProduct)

router
  .route('/categories/:categoryId/:productId')
  .get(protect, authorize('seller'), getProductByCategoryAndProductId)
router
  .route('/categories/:categoryId/:productId/photo')
  .put(protect, authorize('seller'), productPhotoUpload)

module.exports = router
