const mongoose = require('mongoose')
const Ingredient = require('./Ingredient')
const Schema = mongoose.Schema

const recipesSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Recipe name is required!'],
    },
    image: {
      type: Buffer,
    },
    photo: {
      type:String
    },
    instructions: {
      type: String,
      trim: true,
      default: '',
    },
    cookingTime: {
      type: String,
      trim: true,
      required: [true, 'Cooking time is required!'],
    },
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

recipesSchema.methods.toJSON = function () {
  const recipeObj = this.toObject()

  delete recipeObj.image 

  return recipeObj
}

recipesSchema.pre('remove', async function (next) {
  await Ingredient.deleteMany({ recipe: this._id })
  next()
})

module.exports = mongoose.model('Recipe', recipesSchema)
