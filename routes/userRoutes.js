const express = require('express')
const {
  signUp,
  login,
  readProfile,
  logout,
  updateProfile,
  deleteProfile,
} = require('../controllers/userControllers')
const { protect } = require('../middlewares/auth')

const router = new express.Router()

router.route('/signup').post(signUp)
router.route('/login').post(login)
router.route('/logout').get(protect, logout)

router
  .route('/me')
  .get(protect, readProfile)
  .patch(protect, updateProfile)
  .delete(protect, deleteProfile)

module.exports = router
