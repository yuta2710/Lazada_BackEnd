const express = require("express");
const { register, login, getMe, logOut } = require("./auth.controller");

const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logOut);

module.exports = router;
