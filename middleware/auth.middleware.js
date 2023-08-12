const userModel = require("../modules/user/user.model");
const ErrorResponse = require("../utils/error.util");
const asyncHandler = require("./async.middleware");
const jwt = require("jsonwebtoken");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

    console.log("TOKEN = ", token);

	// Make sure token exists
	if (!token) {
		return next(
			new ErrorResponse(
				"Not authorize to access this route",
				401
			)
		);
	}

	try {
		// Varify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await userModel.findById(decoded.id);

		next();
	} catch (err) {
		return next(
			new ErrorResponse(
				401,
				"Not authorize to access this route"
			)
		);
	}
});

// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					403,
					`User role ${req.user.role} is not authorized to access this route`,
				)
			);
		}
		next();
	};
};