const express = require('express')
const {
  addNutritionist,
  getAllNutritionist,
  getSingleNutritionist,
} = require('../controllers/nutritionistControllers')

const router = new express.Router()

router.route('/').post(addNutritionist).get(getAllNutritionist)

router.route('/:id').get(getSingleNutritionist)

module.exports = router
