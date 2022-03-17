const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../schemas/user')
const Posting = require('../schemas/posting')

// Kyselyjen validointiin tarvittavat middleware -funktiot
const { getPostingValidateMw } = require('../middlewares/posting-middlewares')

// Tämän avulla voidaan hakea halutut postaukset olit kirjautunut tai et
router.get('/', async (req, res) => {
  try {
    const foundPosting = await Posting.find()
    return res.status(200).json(foundPosting)
  } catch (e) {
    return res.status(400).json(e)
  }
})

router.post(
  '/:userId',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const foundUser = await User.findById(req.params.userId)
      if (foundUser) {
        const posting = await Posting.create({
          userId: req.params.userId,
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          location: req.body.location,
          price: req.body.price,
          images: req.body.images,
          deliveryType: req.body.deliveryType,
          contactInfo: req.body.contactInfo,
        })
        return res.status(201).json(posting)
      } else {
        return res.status(404).json({ error: 'user not found' })
      }
    } catch (e) {
      return res.status(400).json(e.message)
    }
  }
)

router.put(
  '/:userId/:postingId',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const foundPosting = await Posting.findByIdAndUpdate(
        req.params.postingId,
        req.body,
        { new: true }
      )
      return res.status(202).json(foundPosting)
    } catch (e) {
      return res.status(400).json(e)
    }
  }
)

router.delete(
  '/:userId/:postingId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Posting.findByIdAndDelete(req.params.postingId)
      res.sendStatus(202)
    } catch (e) {
      return res.status(400).json(e)
    }
  }
)

module.exports = { router }
