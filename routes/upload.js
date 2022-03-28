const express = require('express')
const router = express.Router()
const Posting = require('../schemas/posting')
const passport = require('passport')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

// Config cloudinary storage for multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '',
  },
})

const parser = multer({ storage: storage })

router.put(
  '/',
  parser.array('images', 4),
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const foundPosting = await Posting.findById(req.params.postingId)
      if (foundPosting) {
        req.files.map((p) => {
          foundPosting.images.push(p.path)
        })
        res.sendStatus(200)
      }
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router
