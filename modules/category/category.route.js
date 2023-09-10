const express = require("express");

const {
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createMainCategory,
  createSubCategory,
  getAllSubCategories,
  deleteSubCategory,
} = require("./category.controller");
const { protect, authorize } = require("../../middleware/auth.middleware");
const router = express.Router();
const dynamicQueryResponse = require("../../middleware/dynamicQueryResponse.middleware");
const categoryModel = require("./category.model");
const { populateConfigurations } = require("../../utils/populator.util");

router
  .route("/")
  .get(getAllCategories)
  .post(protect, authorize("admin"), createMainCategory);
router
  .route("/:parentId/subCategories")
  .get(getAllSubCategories)
  .post(protect, authorize("admin"), createSubCategory);

router
  .route("/:parentId/subCategories/:subCategoryId")
  .delete(protect, authorize("admin"), deleteSubCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
