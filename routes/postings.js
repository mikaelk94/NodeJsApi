const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')

// Tämän avulla voidaan hakea halutut postaukset olit kirjautunut tai et
router.get('/', (req, res) => {
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
      console.log('query params:', req.query)

      // Käydään läpi kaikki mahdolliset skenaariot kolmen sallitun parametrin osalta
      if (hasCategory && hasDate && hasLocation) {
        postings.find((p) => {
          if (
            p.category == req.query.category &&
            p.location == req.query.location &&
            p.postDate == req.query.date
          ) {
            matchingPostings.push(p)
          }
        })
      } else if (!hasCategory && hasDate && hasLocation) {
        postings.find((p) => {
          if (
            p.postDate == req.query.date &&
            p.location == req.query.location
          ) {
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
          if (
            p.category == req.query.category &&
            p.postDate == req.query.date
          ) {
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
          if (p.postDate == req.query.date) {
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
      console.log('matches: ', matchingPostings.length)
      if (matchingPostings.length > 0) {
        res.json(matchingPostings)
      }
    }
    // Jos parametreja ei ole, palautetaan kaikki postaukset
    else {
      res.json(postings)
      console.log(
        'no parameters given, total amount of postings: ',
        postings.length
      )
    }
  } else {
    // Jos postauksia ei ole olemassa
    res.sendStatus(404)
  }
})

router.post(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let posting = {
      userId: req.params.userId,
      postingId: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.category,
      images: [null],
      price: req.body.price,
      postDate: req.body.postDate,
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
    console.log(
      `Posting created by: ${posting.contactInfo.firstName} ${posting.contactInfo.lastName}`,
      posting
    )
    res.sendStatus(201)
  }
)

router.put(
  '/:userId/:postingId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(parseInt(req.params.userId))
    console.log(parseInt(req.params.postingId))
    let index = -1

    for (let i = 0; i < postings.length; i++) {
      if (
        postings[i].userId === parseInt(req.params.userId) &&
        postings[i].postingId === parseInt(req.params.postingId)
      ) {
        index = i
        break
      }
      postings[index].title = req.body.title
      postings[index].description = req.body.description
      /*postings[index].category = req.body.category
  postings[index].location = req.body.location
  postings[index].images = req.body.images
  postings[index].price = req.body.price
  postings[index].postDate = req.body.postDate
  postings[index].shipping = req.body.shipping
  postings[index].pickup = req.body.pickup
  postings[index].firstName = req.body.firstName
  postings[index].lastName = req.body.lastName
  postings[index].phoneNum = req.body.phoneNum
  postings[index].email = req.body.email
*/
      res.sendStatus(200)
    }
  }
)

module.exports = router

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
    postDate: '2022-01-27',
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
    postDate: '2022-01-27',
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
    postDate: '2022-01-27',
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
    postDate: '2022-01-27',
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
