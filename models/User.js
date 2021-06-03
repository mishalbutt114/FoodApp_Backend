const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Recipe = require('../models/Recipe')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required!'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required!'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email!',
      ],
      required: [true, 'Email is required!'],
    },
    password: {
      type: String,
      trim: true,
      minLength: [6, 'Password must be at least 6 characters long!'],
      required: [true, 'Password is required!'],
    },
    age: {
      type: Number,
      min: [0, 'Age must be a positive number!'],
      default: 0,
    },
    address: {
      type: String,
      trim: true,
      minLength: [10, 'Address can not contains more than 25 characters!'],
      default: '',
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.methods.toJSON = function () {
  const userObject = this.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SERCRET)
  user.tokens = user.tokens.concat({ token })

  await user.save()

  return token
}

userSchema.methods.matchPassword = async function (password) {
  const user = this

  return await bcrypt.compare(password, user.password)
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }

  next()
})

userSchema.pre('remove', async function (next) {
  const user = this

  await Recipe.deleteMany({ author: user._id })
  next()
})

module.exports = mongoose.model('User', userSchema)
