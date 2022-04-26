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
    folder: '/postings',
  },
})

const parser = multer({ storage: storage })

router.put(
  '/',
  parser.array('images', 4),
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let imagesArray = []
      req.files.map((p) => {
        imagesArray.push(p.path)
      })
      const foundPosting = await Posting.findById(req.body.postingId)
      if (foundPosting) {
        foundPosting.images = imagesArray
        await foundPosting.save()
        res.sendStatus(200)
      } else {
        res.status(404).json({ error: 'posting not found' })
      }
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router
