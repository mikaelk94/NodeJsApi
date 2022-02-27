const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const postings = require('./postings').postings

router.put('/', upload.array('images', 3), function (req, res, next) {
  /* console.log('multer operation req.files')
  req.files.map((p) => {
    console.log(p.path)
  }) */
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
})

module.exports = router
