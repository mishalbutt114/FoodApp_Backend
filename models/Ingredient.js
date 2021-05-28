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
      min: [0, 'Calories must be positive!'],
      default: 0,
    },
    quantity: {
      type: Number,
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
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Ingredient', ingredientsSchema)
