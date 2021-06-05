const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const hpp = require('hpp')
const xss = require('xss-clean')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const connectDB = require('./db/mongoose')
const errorHandler = require('./middlewares/errorHandler')
const userRoutes = require('./routes/userRoutes')
const recipeRoutes = require('./routes/recipeRoutes')
const ingredientRoutes = require('./routes/ingredientRoutes')
const nutritionistRoutes = require('./routes/nutritionistRoutes')

connectDB()
//MONGODB_URL=mongodb://127.0.0.1:27017/healthy-foods-db

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(mongoSanitize())
// app.use(helmet())
app.use(cors())
// app.use(hpp())
// app.use(xss())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'))
}


app.use('/api/v1/users', userRoutes)
app.use('/api/v1/recipes', recipeRoutes)
app.use('/api/v1/ingredients', ingredientRoutes)
app.use('/api/v1/nutritionists', nutritionistRoutes)

app.use(errorHandler)

const server = app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})

process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error}`)
  server.close(() => process.exit(1))
})
