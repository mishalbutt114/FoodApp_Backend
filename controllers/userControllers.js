const User = require('../models/User')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middlewares/asyncHandler')

//  @url            /api/v1/users/signup
//  @method         POST
//  @description    Register new user
//  @access         Public
exports.signUp = asyncHandler(async (req, res) => {
  const user = new User(req.body)
  const token = await user.generateAuthToken()

  await user.save()

  res.status(201).json({
    success: true,
    token,
  })
})

//  @url            /api/v1/users/login
//  @method         POST
//  @description    Login user
//  @access         Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials!', 404))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials!', 404))
  }

  const token = await user.generateAuthToken()

  res.status(200).json({
    success: true,
    token,
  })
})

//  @url            /api/v1/users/logout
//  @method         GET
//  @description    Logout user
//  @access         Private
exports.logout = asyncHandler(async (req, res) => {
  req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
  await req.user.save()

  res.status(200).json({
    success: true,
  })
})

//  @url            /api/v1/users/me
//  @method         GET
//  @description    Read profile
//  @access         Private
exports.readProfile = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  })
}

//  @url            /api/v1/users/me
//  @method         PATCH
//  @description    Update profile
//  @access         Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const updates = Object.keys(req.body)

  const allowedUpdates = [
    'firstName',
    'lastName',
    'email',
    'password',
    'address',
    'age',
  ]

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return next(new ErrorResponse('Invalid Updates!', 400))
  }

  updates.forEach((update) => (req.user[update] = req.body[update]))
  await req.user.save()

  res.status(200).json({
    success: true,
    data: req.user,
  })
})

//  @url            /api/v1/users/me
//  @method         DELETE
//  @description    Delete profile
//  @access         Private
exports.deleteProfile = asyncHandler(async (req, res) => {
  await req.user.remove()

  res.status(200).json({
    success: true,
  })
})
