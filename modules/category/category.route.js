const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./category.controller");
const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
