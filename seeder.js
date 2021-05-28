const fs = require('fs')
const mongoose = require('mongoose')
const User = require('./models/User')
const Recipe = require('./models/Recipe')
const Nutiritionist = require('./models/Nutritionist')

mongoose.connect('mongodb://127.0.0.1:27017/healthy-foods-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

const nutiritionists = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/nutritionists.json`, 'utf-8')
)

const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/recipes.json`, 'utf-8')
)

const importData = async () => {
  try {
    await User.create(users)
    await Recipe.create(recipes)
    await Nutiritionist.create(nutiritionists)
    console.log('Data Imported...')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

const deleteData = async () => {
  try {
    await User.deleteMany({})
    await Recipe.deleteMany({})
    await Nutiritionist.deleteMany({})
    console.log('Data Deleted...')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
