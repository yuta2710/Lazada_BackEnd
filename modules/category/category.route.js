const express = require("express");

const {
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createMainCategory,
  createSubCategory,
} = require("./category.controller");
const router = express.Router();

router.route("/").get(getAllCategories).post(createMainCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

router.route("/:parentId").post(createSubCategory);
module.exports = router;
