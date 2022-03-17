const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../schemas/user')

// Rekisteröinnin validoimiseen käytetty middleware -funktio
const newUserValidateMw = require('../middlewares/user-middlewares')

// Uuden käyttäjän luonti
router.post('/', newUserValidateMw, async (req, res) => {
  const salt = bcrypt.genSaltSync(6)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  try {
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      dateOfBirth: req.body.dateOfBirth,
    })
    return res.status(201).json(user)
  } catch (e) {
    return res.status(400).json(e)
  }
})

module.exports = { router }
