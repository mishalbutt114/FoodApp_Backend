const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const nutritionistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required!'],
    },
    bio: {
      type: String,
      trim: true,
      max: [100, 'Bio can not be more than 100 characters!'],
      required: [true, 'Bio is required!'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email!',
      ],
      required: [true, 'Email is required!'],
    },
    age: {
      type: Number,
      min: [0, 'Age must be a positive number!'],
      default: 0,
    },
    phoneNo: {
      type: String,
      trim: true,
      required: [true, 'Phone number is required!'],
    },
    address: {
      type: String,
      trim: true,
      required: [true, 'Address is required!'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
)

nutritionistSchema.pre('save', async function (next) {
  const nutritionist = this
  const loc = await geocoder.geocode(nutritionist.address)

  nutritionist.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }

  next()
})

module.exports = mongoose.model('Nutritionist', nutritionistSchema)
