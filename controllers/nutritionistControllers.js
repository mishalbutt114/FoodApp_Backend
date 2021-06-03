const Nutritionist = require('../models/Nutritionist')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middlewares/asyncHandler')

//  @url            /api/v1/nutritionists
//  @method         POST
//  @description    Add new nutritionist
//  @access         (only for your use to add data of nutritionist)
exports.addNutritionist = asyncHandler(async (req, res) => {
  const nutritionist = new Nutritionist(req.body)

  await nutritionist.save()

  res.status(201).json({
    success: true,
    data: nutritionist,
  })
})

//  @url            /api/v1/nutritionists
//  @method         GET
//  @description    Get all the nutritionists
//  @access         Public
exports.getAllNutritionist = asyncHandler(async (req, res) => {
  const nutritionists = await Nutritionist.find({})
    .limit(parseInt(req.query.limit))
    .skip(parseInt(req.query.skip))

  res.status(200).json({
    success: true,
    data: nutritionists,
  })
})

//  @url            /api/v1/nutritionists/:id
//  @method         GET
//  @description    Get single nutritionist
//  @access         Public
exports.getSingleNutritionist = asyncHandler(async (req, res, next) => {
  const nutritionist = await Nutritionist.findById(req.params.id)

  if (!nutritionist) {
    return next(new ErrorResponse('Nutritionist not found!', 400))
  }

  res.status(200).json({
    success: true,
    data: nutritionist,
  })
})
