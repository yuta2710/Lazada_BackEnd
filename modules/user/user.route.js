const express = require("express");
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("./user.controller");
const { protect, authorize } = require("../../middleware/auth.middleware");
const router = express.Router(); // merge the relationship of entities

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
