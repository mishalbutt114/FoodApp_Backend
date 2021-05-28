const NodeGeocoder = require('node-geocoder')

const options = {
  provider:'mapquest',
  httpAdapter: 'https',
  apiKey: '3hrO7xwdSGc1QfA1k5keUZ7RFOFR1Tlw',
  formatter: null,
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder
