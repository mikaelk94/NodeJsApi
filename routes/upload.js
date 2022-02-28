const express = require('express')
const router = express.Router()
const postings = require('./postings').postings
const passport = require('passport')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

// Config cloudinary storage for multer-storage-cloudinary
var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '',
  },
})

var parser = multer({ storage: storage })

router.put(
  '/',
  parser.array('images', 3),
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    let foundPosting = postings.find(
      (p) => p.userId == req.body.userId && p.postingId == req.body.postingId
    )
    if (foundPosting) {
      req.files.map((p) => {
        foundPosting.images.push(p.path)
      })
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  }
)

module.exports = router
