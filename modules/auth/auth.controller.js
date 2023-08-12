const asyncHandler = require("../../middleware/async.middleware");
const ErrorResponse = require("../../utils/error.util");
const { createToken } = require("../../utils/token.util");
const userModel = require("../user/user.model");

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, phone, password, address, role } = req.body;

    console.table([{ name, email, phone, password, address, role }]);

    const user = await userModel.create({
        name,
        email,
        phone,
        password,
        address,
        role,
    });

    const token = await createToken(user);

    res.status(201).json({
        success: true,
        token,
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next(
            new ErrorResponse(400, `Please provide the email and password`)
        );
    }

    // Check for user
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse(401, `Invalid credentials`));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse(401, `Invalid credentials`));
    }

    const token = createToken(user);

    res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
        })
        .json({
            success: true,
            token,
        });
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});