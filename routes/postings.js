const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')

// Tämän avulla voidaan hakea kaikki postaukset olit kirjautunut tai et
router.get('/', (req, res) => {
  if (postings.length > 0) {
    res.json(postings)
  } else {
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
    postingId: 120,
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
    userId: 1,
    postingId: 110,
    title: 'Example posting2',
    description: 'example2',
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
    userId: 2,
    postingId: 10,
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
    userId: 2,
    postingId: 1,
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
