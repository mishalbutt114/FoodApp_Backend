const express = require('express')
const { default: strictTransportSecurity } = require('helmet/dist/middlewares/strict-transport-security')
const {
  addIngredient,
  getAllIngreidents,
  getSingleIngredient,
  storeIngredients
} = require('../controllers/ingredientControllers')
const { protect } = require('../middlewares/auth')

const router = new express.Router()

router
  .route('/')
  .get(getAllIngreidents)
  .post(storeIngredients)
router
  .route('/:id/recipes')
  .post(protect, addIngredient)
  .get(getSingleIngredient)

module.exports = router
