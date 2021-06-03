const sharp = require('sharp')
const Recipe = require('../models/Recipe')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middlewares/asyncHandler')
const Ingredient = require('../models/Ingredient')

//  @url            /api/v1/recipes
//  @method         POST
//  @description    Create new recipe
//  @access         Private
exports.createRecipe = asyncHandler(async (req, res) => {
  let  ing = new Ingredient({
    ...req.body,
    name : req.body.ingredients,
  });
  ing = await ing.save();
  const recipe = new Recipe({
    ...req.body,
    ingredients:[ing._id],
    author: req.user._id,
  })

  await recipe.save()

  res.status(201).json({
    success: true,
    data: recipe,
  })
})

//  @url            /api/v1/recipes
//  @method         GET
//  @description    Get all the recipes
//  @access         Public
exports.getAllRecipes = asyncHandler(async (req, res) => {
  const sort = {}
  const filter = {}

  let query

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  const recipes = await Recipe.find(filter)
    .populate('ingredients')
    .sort(sort)
    .limit(parseInt(req.query.limit))
    .skip(parseInt(req.query.skip))

  if (req.query.search) {
    const parts = req.query.search.split(':')
    filter.name = parts[1]

    query = recipes.filter((recipe) => {
      return recipe.name.toLowerCase().includes(filter.name.toLowerCase())
    })
  }

  res.status(200).json({
    success: true,
    data: req.query.search ? query : recipes,
  })
})

//  @url            /api/v1/recipes/:id
//  @method         GET
//  @description    Get single recipe
//  @access         Public
exports.getSingleRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    return next(new ErrorResponse('Recipe not found!', 400))
  }

  res.status(200).json({
    success: true,
    data: recipe,
  })
})

//  @url            /api/v1/recipes/:id
//  @method         PATCH
//  @description    Update particular recipe
//  @access         Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const updates = Object.keys(req.body)

  const allowedUpdates = ['name', 'instructions', 'cookingTime']

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return next(new ErrorResponse('Invalid Updates!', 400))
  }

  let recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    return next(new ErrorResponse('Recipe not found!', 400))
  }

  if (recipe.author !== req.user._id) {
    return next(
      new ErrorResponse(`You not authorized to update this recipe!`, 401)
    )
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: recipe,
  })
})

//  @url            /api/v1/recipes/:id
//  @method         DELETE
//  @description    Delete recipe
//  @access         Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    return next(new ErrorResponse('Recipe not found!', 400))
  }

  if (recipe.author !== req.user._id) {
    return next(
      new ErrorResponse(`You not authorized to delete this recipe!`, 401)
    )
  }

  await recipe.remove()

  res.status(200).json({
    success: true,
  })
})

//  @url            /api/v1/recipes/:id/image
//  @method         POST
//  @description    Upload image for recipe
//  @access         Private
exports.uploadRecipeImage = asyncHandler(
  async (req, res, next) => {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      author: req.user._id,
    })

    if (!recipe) {
      return next(new ErrorResponse('Recipe not found!', 400))
    }

    const buffer = await sharp(req.file.buffer).png().toBuffer()

    recipe.image = buffer
    await recipe.save()

    res.status(201).json({
      success: true,
    })
  },
  (error, req, res, next) => {
    next(new ErrorResponse(error.message, 500))
  }
)

//  @url            /api/v1/recipes/:id/image
//  @method         GET
//  @description    Get recipe image
//  @access         Public
exports.getRecipeImage = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe || !recipe.image) {
    return next(new ErrorResponse('Not found!', 400))
  }

  res.set('Content-Type', 'image/png')
  res.status(200).send(recipe.image)
})

//  @url            /api/v1/recipes/:id/image
//  @method         DELETE
//  @description    Delete recipe image
//  @access         Private
exports.deleteRecipeImage = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findOne({
    _id: req.params.id,
    author: req.user._id,
  })

  recipe.image = undefined
  await recipe.save()

  res.status(200).json({
    success: true,
  })
})
