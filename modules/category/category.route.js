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
const router = express.Router();

router.route("/").get(getAllCategories).post(createMainCategory);
router
  .route("/:parentId/subCategories")
  .get(getAllSubCategories)
  .post(createSubCategory);

router
  .route("/:parentId/subCategories/:subCategoryId")
  .delete(deleteSubCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
