const Ingredient = require('../models/Ingredient')
const Recipe = require('../models/Recipe')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

//  @url            /api/v1/ingredients/:id/recipes
//  @method         POST
//  @description    Add ingredient to the recipe
//  @access         Private
exports.addIngredient = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findOne({
    _id: req.params.id,
    author: req.user._id,
  })

  if (!recipe) {
    return next(new ErrorResponse('Recipe not found!', 400))
  }

  const ingredient = new Ingredient({
    ...req.body,
    recipe: req.params.id,
  })

  recipe.ingredients.push(ingredient)

  await ingredient.save()
  await recipe.save()

  res.status(201).json({
    success: true,
    data: ingredient,
  })
})

//  @url            /api/v1/ingredients
//  @method         GET
//  @description    Get all the ingredients
//  @access         Public
exports.getAllIngreidents = asyncHandler(async (req, res) => {
  const filter = {}

  let query

  const ingredients = await Ingredient.find({})
    .limit(parseInt(req.query.limit))
    .skip(parseInt(req.query.skip))

  if (req.query.search) {
    const parts = req.query.search.split(':')
    filter.name = parts[1]

    query = ingredients.filter((ingredient) => {
      return ingredient.name.toLowerCase().includes(filter.name.toLowerCase())
    })
  }

  res.status(200).json({
    success: true,
    data: req.query.search ? query : ingredients,
  })
})

//  @url            /api/v1/ingredients/:id/recipes
//  @method         GET
//  @description    Get single ingredient
//  @access         Public
exports.getSingleIngredient = asyncHandler(async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.params.id)

  if (!ingredient) {
    return next(new ErrorResponse('Ingredient not found!', 400))
  }

  res.status(200).json({
    success: true,
    data: ingredient,
  })
})
exports.storeIngredients = asyncHandler(async (req, res, next) => {
 let ingredients = await  Ingredient.create(req.body.ingredients);

  res.status(200).json({
    success: true,
    data: ingredients,
  })
})
