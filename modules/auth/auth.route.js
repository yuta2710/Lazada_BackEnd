const express = require("express");
const { register, login, getMe } = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");
const router = express.Router(); // merge the relationship of entities

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/me").get(getMe);

module.exports = router;
