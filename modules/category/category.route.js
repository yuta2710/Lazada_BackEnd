const express = require("express");

const { createCategory, getAllCategories } = require("./category.controller");
const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

module.exports = router;
