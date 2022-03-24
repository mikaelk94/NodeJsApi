const Posting = require('../schemas/posting')

const getPostingValidateMw = async (req, res, next) => {
  try {
    // Selvitetään, tuliko kyselyn mukana parametreja. hasOwnProperty()-metodi palauttaa boolean arvon 'true' tai 'false' jos kyseinen parametri löytyy. Arvo tallennetaan let -muuttujaan myöhempää käyttöä varten.
    let hasCategory = req.query.hasOwnProperty('category')
    let hasLocation = req.query.hasOwnProperty('location')
    let hasDate = req.query.hasOwnProperty('date')

    if (hasCategory || hasLocation || hasDate) {
      if (hasCategory) {
        const response = await Posting.find({ category: req.query.category })
        return res.status(200).json(response)
      }
      if (hasLocation) {
        const response = await Posting.find({ location: req.query.location })
        return res.status(200).json(response)
      }
      if (hasDate) {
        const response = await Posting.find({ createdAt: req.query.date })
        return res.status(200).json(response)
      }
    } else {
      next()
    }
  } catch (e) {
    next(e)
  }
}

module.exports = getPostingValidateMw
