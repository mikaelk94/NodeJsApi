const express = require('express')
const router = express.Router()
const passport = require('../middlewares/authentication/passport')
const jwt = require('jsonwebtoken')
/* const { avain } = require('../secrets') */

/**************** Login ****************/
router.post(
  '/',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const payloadData = {
      userId: req.user.id,
    }
    const token = jwt.sign(payloadData, process.env.avain || avain)
    const userInfo = {
      username: req.user.username,
      userId: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNum: req.user.phoneNum,
      email: req.user.email,
    }
    res.json({
      token: token,
      user: userInfo,
    })
    //console.log('payloadData:', payloadData)
  }
)

module.exports = router
