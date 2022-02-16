const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

// tällä voidaan luoda uusi käyttäjä
router.post('/', (req, res) => {
  const salt = bcrypt.genSaltSync(6)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  const user = {
    userId: uuidv4(),
    testId: 10,
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
  console.log('User created:', user)
  res.sendStatus(201)
})

router.get('/postings/:userId', (req, res) => {
  console.log(req.params.userId)
  var tulostus = []
  let index = -1

  for (let i = 0; i < postings.length; i++) {
    if (postings[i].userId === parseInt(req.params.userId)) {
      index = i
      tulostus.push(postings[index])
    }
  }
  if (index === -1) {
    res.sendStatus(404)
  } else {
    res.json(tulostus)
  }
})

// tällä voidaan hakea käyttäjä id:n perusteella lähinnä omia testejä varten
router.get('/:testId', (req, res) => {
  let foundIndex = -1
  for (let i = 0; i < users.length; i++) {
    if (users[i].testId === parseInt(req.params.testId)) {
      foundIndex = i
      break
    }
  }
  if (foundIndex === -1) {
    res.sendStatus(404)
  } else {
    res.json(users[foundIndex])
  }
})

// Users lista jonne tallennetaan käyttäjät
// muutama hard koodattu hakemisen testaamisen helpottamiseksi
// testId lisätty hakemisen testaamiseen, koska uuidv4 kanssa hankalampaa
const users = [
  {
    userId: uuidv4(),
    testId: 1,
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
    testId: 2,
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
