const asyncHandler = require('../../middleware/async.middleware')
const ErrorResponse = require('../../utils/error.util')
const { createToken } = require('../../utils/token.util')
const userModel = require('../user/user.model')

/**
 * @des:     Register user
 * @route:   POST /api/v1/auth/register
 * @access:  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phone_number, password, business, address, role } =
    req.body

  console.table([
    { name, email, phone_number, password, business, address, role }
  ])

  let user

  if (
    !(
      (await userModel.findOne({ phone_number: phone_number })) ||
      (await userModel.findOne({ email: email }))
    )
  ) {
    if (role === 'seller' || business) {
      user = await userModel.create({
        name,
        email,
        phone_number,
        password,
        address,
        role,
        business,
        status: 'Pending'
      })
      // user.set("business", business);
      await user.save()
    } else {
      user = await userModel.create({
        name,
        email,
        phone_number,
        password,
        address,
        role
      })
    }
  } else {
    res.status(201).json({
      success: false,
      message: 'Phone number or email already exists'
    })
  }

  const token = await createToken(user)

  res.status(201).json({
    success: true,
    token
  })
})

/**
 * @des:     Login user
 * @route:   POST /api/v1/auth/login
 * @access:  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body

  console.table({ identifier, password })
  // Validate email and password
  if (!identifier || !password) {
    return next(
      new ErrorResponse(
        400,
        `Please provide the email/phone-number and password`
      )
    )
  }

  let user
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const regexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

  if (regexEmail.test(identifier)) {
    user = await userModel.findOne({ email: identifier }).select('+password')
  }

  if (regexPhoneNumber.test(identifier)) {
    user = await userModel
      .findOne({ phone_number: identifier })
      .select('+password')
  }

  // Check for user
  if (!user) {
    res.status(200).json({
      success: false,
      message: `Invalid credentials`
    })
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    res.status(200).json({
      success: false,
      message: `Invalid credentials`
    })
  }

  const token = createToken(user)

  res
    .status(200)
    .cookie('token', token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      )
    })
    .json({
      success: true,
      token
    })
})

/**
 * @des:     Get me
 * @route:   GET /api/v1/auth/login
 * @access:  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user
  })
})

exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    data: {}
  })
})
