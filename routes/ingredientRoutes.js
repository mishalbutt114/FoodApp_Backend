const express = require('express')
const {
  addIngredient,
  getAllIngreidents,
  getSingleIngredient,
} = require('../controllers/ingredientControllers')
const { protect } = require('../middlewares/auth')

const router = new express.Router()

router.route('/').get(getAllIngreidents)

router
  .route('/:id/recipes')
  .post(protect, addIngredient)
  .get(getSingleIngredient)

module.exports = router
