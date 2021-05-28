const express = require('express')
const {
  createRecipe,
  getAllRecipes,
  getSingleRecipe,
  deleteRecipe,
  updateRecipe,
  uploadRecipeImage,
  getRecipeImage,
  deleteRecipeImage,
} = require('../controllers/recipeControllers')
const { protect } = require('../middlewares/auth')
const upload = require('../utils/upload')

const router = new express.Router()

router.route('/').post(protect, createRecipe).get(getAllRecipes)

router
  .route('/:id')
  .get(getSingleRecipe)
  .patch(protect, updateRecipe)
  .delete(protect, deleteRecipe)

router
  .route('/:id/image')
  .post(protect, upload.single('avatar'), uploadRecipeImage)
  .get(getRecipeImage)
  .delete(protect, deleteRecipeImage)

module.exports = router
