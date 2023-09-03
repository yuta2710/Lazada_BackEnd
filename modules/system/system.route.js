const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const router = express.Router();
const { initServerID } = require("./system.controller");

router.use(protect);
router.use(authorize("admin"));

router.route("/init/id/:limit").get(initServerID);

module.exports = router;
