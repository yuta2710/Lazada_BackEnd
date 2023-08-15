const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const userModel = require("./user.model");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone_number, password, address, role, business } =
    req.body;

  console.table([{ name, email, phone_number, password, address, role }]);

  let user;

  if (!(await userModel.findOne({ phone_number: phone_number }))) {
    if (role === "seller" && business) {
      user = await userModel.create({
        name,
        email,
        phone_number,
        password,
        address,
        role,
        business,
      });
      user.set("business", business);
      await user.save();
    } else {
      user = await userModel.create({
        name,
        email,
        phone_number,
        password,
        address,
        role,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Duplicate error. A phone-number should be unique",
    });
  }
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
  const user = await userModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .exec();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateSellerBusiness = asyncHandler(async (req, res, next) => {
  const { business } = req.body;
  let user;

  if (req.user.role === "seller" || req.user.role === "admin") {
    user = await userModel
      .findByIdAndUpdate(req.params.id, { business }, { new: true })
      .exec();
  }
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
