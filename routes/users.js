const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

// Rekisteröinnin validoimiseen käytetty middleware -funktio
const newUserValidateMw =
  require('../middlewares/json-validation/users-path-ajv').newUserValidateMw

// tällä voidaan luoda uusi käyttäjä
router.post('/', newUserValidateMw, (req, res) => {
  const salt = bcrypt.genSaltSync(6)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  let emailTaken = users.find((p) => p.email == req.body.email)

  if (!emailTaken) {
    const user = {
      userId: uuidv4(),
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      dateOfBirth: req.body.dateOfBirth,
      emailVerified: req.body.emailVerified,
      createDate: req.body.createDate,
    }

    users.push(user)
    // console.log('User created:', user)
    res.json(user)
  } else {
    res.sendStatus(409)
  }
})

// Users lista jonne tallennetaan käyttäjät
const users = [
  {
    userId: uuidv4(),
    username: 'MikkoM',
    password: 'salasana',
    firstName: 'Mikko',
    lastName: 'Majakka',
    email: 'user@example.com',
    phoneNum: '045-2098621',
    dateOfBirth: '1997-10-31',
    emailVerified: true,
    createDate: '2019-08-24',
  },
  {
    userId: uuidv4(),
    username: 'MaijaM',
    password: 'salasana',
    firstName: 'Maija',
    lastName: 'Majakka',
    email: 'user@example.com',
    phoneNum: '045-2098621',
    dateOfBirth: '1997-10-31',
    emailVerified: true,
    createDate: '2019-08-24',
  },
]

module.exports = { router, users }
