const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  const decoded = jwt.verify(token, process.env.JWT_SERCRET)
  const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

  if (!user) {
    return next(new ErrorResponse('Please authenticate!', 401))
  }

  req.token = token
  req.user = user

  next()
})
