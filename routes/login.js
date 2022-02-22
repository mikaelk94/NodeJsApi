const express = require('express')
const router = express.Router()
const passport = require('../middlewares/authentication/passport')
const jwt = require('jsonwebtoken')
const avain = require('../secrets')



/**************** Login ****************/
router.post(
  '/',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const payloadData = {
      userId: req.user.user.userId,
    }
    const token = jwt.sign(payloadData, 'avain')
    res.json({ token: token })
    console.log('payloadData:', payloadData)
  }
)

module.exports = router
