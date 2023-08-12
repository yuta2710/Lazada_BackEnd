const express = require("express");
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("./user.controller");
const router = express.Router(); // merge the relationship of entities

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
