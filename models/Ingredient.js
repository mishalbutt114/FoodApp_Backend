const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ingredientsSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Recipe name is required!'],
    },
    calories: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: String,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    healthy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Ingredient', ingredientsSchema)
