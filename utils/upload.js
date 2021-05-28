const multer = require('multer')

const upload = multer({
  limits: {
    fileSize: process.env.RECIPE_IMAGE_SIZE,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please provide valid image!'))
    }

    cb(undefined, true)
  },
})

module.exports = upload
