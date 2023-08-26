const asyncHandler = require("../../middleware/async.middleware");
const userModel = require("./user.model");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone_number, password, address, role, business } =
    req.body;

  let user;

  if (!(await userModel.findOne({ phone_number: phone_number }))) {
    if (role === "seller" || business) {
      user = await userModel.create({
        name,
        email,
        phone_number,
        password,
        address,
        role,
        business,
        status: "pending",
      });
      // user.set("business", business);
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

  return user;
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    count: users.length,
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

  if ((req.user.role === "seller" || req.user.role === "admin") && business) {
    user = await userModel
      .findByIdAndUpdate(req.params.id, { business }, { new: true })
      .exec();
  } else {
    res.status(400).json({
      success: false,
      message: "Unable to update a business field of user",
    });
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

exports.acceptUserStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  let user = await userModel.findById(id);
  const validStatusValues = ["Approved", "Rejected", "Pending"];

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.role === "seller") {
    if (validStatusValues.includes(status)) {
      user = await userModel.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
    } else {
      user = await userModel.findByIdAndUpdate(
        id,
        { status: "" },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "You can only update account status for 'seller' role",
    });
  }
});
