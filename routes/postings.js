const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')
const users = require('./users').users

// Kyselyjen validointiin tarvittavat middleware -funktiot
const {
  newPostingValidateMw,
  getPostingValidateMw,
  modifyPostingValidateMw,
} = require('../middlewares/json-validation/postings-path-ajv')

// Tämän avulla voidaan hakea halutut postaukset olit kirjautunut tai et
router.get('/', getPostingValidateMw, (req, res) => {
  // Jos postauksia on olemassa
  if (postings.length > 0) {
    // Selvitetään, tuliko kyselyn mukana parametreja. hasOwnProperty()-metodi palauttaa boolean arvon 'true' tai 'false' jos kyseinen parametri löytyy. Arvo tallennetaan let -muuttujaan myöhempää käyttöä varten.
    let hasCategory = req.query.hasOwnProperty('category')
    let hasLocation = req.query.hasOwnProperty('location')
    let hasDate = req.query.hasOwnProperty('date')

    // Taulukko johon halutut postaukset tallennetaan ja lähetetään vastauksessa.
    let matchingPostings = []

    // Käydään läpi kaikki mahdolliset skenaariot kolmen sallitun parametrin osalta. Kolmella parametrilla eri mahdollisuuksia on 3^2 = 9.
    if (hasCategory || hasDate || hasLocation) {
      // console.log('query params:', req.query)

      // Käydään läpi kaikki mahdolliset skenaariot kolmen sallitun parametrin osalta
      if (hasCategory && hasDate && hasLocation) {
        postings.find((p) => {
          if (
            p.category == req.query.category &&
            p.location == req.query.location &&
            p.date == req.query.date
          ) {
            matchingPostings.push(p)
          }
        })
      } else if (!hasCategory && hasDate && hasLocation) {
        postings.find((p) => {
          if (p.date == req.query.date && p.location == req.query.location) {
            matchingPostings.push(p)
          }
        })
      } else if (hasCategory && !hasDate && hasLocation) {
        postings.find((p) => {
          if (
            p.location == req.query.location &&
            p.category == req.query.category
          ) {
            matchingPostings.push(p)
          }
        })
      } else if (hasCategory && hasDate && !hasLocation) {
        postings.find((p) => {
          if (p.category == req.query.category && p.date == req.query.date) {
            matchingPostings.push(p)
          }
        })
      } else if (hasCategory && !hasDate && !hasLocation) {
        postings.find((p) => {
          if (p.category == req.query.category) {
            matchingPostings.push(p)
          }
        })
      } else if (!hasCategory && hasDate && !hasLocation) {
        postings.find((p) => {
          if (p.date == req.query.date) {
            matchingPostings.push(p)
          }
        })
      } else if (!hasCategory && !hasDate && hasLocation) {
        postings.find((p) => {
          if (p.location == req.query.location) {
            matchingPostings.push(p)
          }
        })
      }
      // console.log('matches: ', matchingPostings.length)
      if (matchingPostings.length > 0) {
        res.json(matchingPostings)
      }
    }
    // Jos parametreja ei ole, palautetaan kaikki postaukset
    else {
      res.json(postings)
      /* console.log(
        'no parameters given, total amount of postings: ',
        postings.length
      ) */
    }
  } else {
    // Jos postauksia ei ole olemassa
    res.sendStatus(404)
  }
})

router.post(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  newPostingValidateMw,

  (req, res) => {
    let foundUser = users.find((p) => p.userId === req.params.userId)
    if (foundUser) {
      let posting = {
        userId: req.params.userId,
        postingId: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        images: req.body.images,
        price: req.body.price,
        date: req.body.date,
        deliveryType: {
          shipping: req.body.deliveryType.shipping,
          pickup: req.body.deliveryType.pickup,
        },
        contactInfo: {
          firstName: req.body.contactInfo.firstName,
          phoneNum: req.body.contactInfo.phoneNum,
          lastName: req.body.contactInfo.lastName,
          email: req.body.contactInfo.email,
        },
      }
      postings.push(posting)
      /* console.log(
        `Posting created by: ${posting.contactInfo.firstName} ${posting.contactInfo.lastName}`,
        posting
      ) */
      // res.sendStatus(201)
      res.json(posting)
    } else {
      res.sendStatus(400)
    }
  }
)

router.put(
  '/:userId/:postingId',
  passport.authenticate('jwt', { session: false }),
  modifyPostingValidateMw,

  (req, res) => {
    // Käydään postings-taulukko läpi find()-metodilla, joka palauttaa 'true' jos id:t mätsää, tai 'false' jos ei. Tallenetaan arvo let -muuttujaan
    let foundPosting = postings.find(
      (p) =>
        p.userId == req.params.userId && p.postingId == req.params.postingId
    )

    // Jos postaus löytyi
    if (foundPosting) {
      // Käydään for-in -loopilla läpi jokainen postauksessa ja req.body -objektissa oleva 'property' (p),
      // ja annetaan postauksessa olevalle 'propertylle' uudeksi arvoksi req.body -objektissa olevan 'propertyn' arvo
      for (p in (foundPosting, req.body)) {
        foundPosting[p] = req.body[p]
      }
      res.sendStatus(202)
    } else {
      // Jos postausta ei löytynyt annetuilla id-parametreilla
      res.sendStatus(404)
    }
  }
)

router.delete(
  '/:userId/:postingId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let foundPosting = postings.find(
      (p) =>
        p.userId == req.params.userId && p.postingId == req.params.postingId
    )
    if (foundPosting) {
      postings.splice(foundPosting, 1)
      res.sendStatus(202)
    } else {
      // Jos postausta ei löytynyt annetuilla id-parametreilla
      res.sendStatus(404)
    }
  }
)

// Postings lista jonne postaukset tallennetaan
// Muutama hard koodattu hakemisen testaamisen helpottamiseksi

const postings = [
  {
    userId: 1,
    postingId: 1,
    title: 'Example posting',
    description: 'example',
    category: 'Konsolit',
    location: 'Oulu',
    images: [null],
    price: '1000',
    date: '2022-01-27',
    deliveryType: {
      shipping: true,
      pickup: true,
    },
    contactInfo: {
      firstName: 'example',
      lastName: 'example',
      phoneNum: '045-2098621',
      email: 'user@example.com',
    },
  },
  {
    userId: 2,
    postingId: 2,
    title: 'Example posting2',
    description: 'example2',
    category: 'Ajoneuvot',
    location: 'Finland',
    images: [null],
    price: '1000',
    date: '2022-01-26',
    deliveryType: {
      shipping: true,
      pickup: true,
    },
    contactInfo: {
      firstName: 'example',
      lastName: 'example',
      phoneNum: '045-2098621',
      email: 'user@example.com',
    },
  },
  {
    userId: 3,
    postingId: 3,
    title: 'Example posting',
    description: 'example',
    category: 'Test',
    location: 'Finland',
    images: [null],
    price: '1000',
    date: '2022-01-25',
    deliveryType: {
      shipping: true,
      pickup: true,
    },
    contactInfo: {
      firstName: 'example',
      lastName: 'example',
      phoneNum: '045-2098621',
      email: 'user@example.com',
    },
  },
  {
    userId: 4,
    postingId: 4,
    title: 'Example posting',
    description: 'example',
    category: 'Test',
    location: 'Finland',
    images: [null],
    price: '1000',
    date: '2022-01-25',
    deliveryType: {
      shipping: true,
      pickup: true,
    },
    contactInfo: {
      firstName: 'example',
      lastName: 'example',
      phoneNum: '045-2098621',
      email: 'user@example.com',
    },
  },
]

module.exports = { router, postings }
