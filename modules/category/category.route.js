const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
} = require("./category.controller");
const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

router.route("/:id").get(getCategory);

module.exports = router;
