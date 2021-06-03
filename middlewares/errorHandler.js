const ErrorResponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message

  // for development mode
  console.log(err.stack)

  if (err.name === 'CastError') {
    const message = `Resource not found!`
    error = new ErrorResponse(message, 400)
  }

  if (err.code === 11000) {
    const message = 'Duplicate field entered!'
    error = new ErrorResponse(message, 400)
  }

  if (err.code === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error!',
  })
}

module.exports = errorHandler
