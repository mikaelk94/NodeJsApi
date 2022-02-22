const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/'})


router.post('/', upload.single('image'), function(req, res, next) {
 
    console.log('multer operation req.file')
    console.log(req.file)
  
    res.sendStatus(200)
  })

  module.exports = router