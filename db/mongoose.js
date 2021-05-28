const mongoose = require('mongoose')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

  console.log(`Database Connected: ${conn.connection.host}`)
}

module.exports = connectDB
