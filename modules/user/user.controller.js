const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("./user.model");
// const {
//     createUser,
//     updateUserById,
//     fetchAllUsers,
//     fetchUserById,
//     deleteUserById,
// } = require("./user.service");

exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, phone, password, address, role } = req.body;

    console.table([{ name, email, phone, password, address, role }]);

    const user = await userModel.create({name, email, phone, password, address, role});

    res.status(201).json({
        success: true,
        data: user,
    });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel.find().exec();

    res.status(200).json({
        success: true,
        data: users,
    });
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id).exec();

    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec();

    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    await userModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {},
    });
});

