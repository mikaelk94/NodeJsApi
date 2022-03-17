const Ajv = require('ajv')

const ajv = new Ajv()

const newPostingValidateMw = async (req, res, next) => {
  const Posting = require('../schemas/posting')
  const newPostingValidator = ajv.compile(Posting)
  const validationResult = newPostingValidator(req.body)
  // console.log(validationResult)

  if (validationResult) {
    next()
  } else {
    res.sendStatus(400)
  }
}

const modifyPostingValidateMw = (req, res, next) => {
  const modifyPosting = require('../../schemas/posting-schemas/requests/updatePosting.schema.json')
  const modifyPostingValidator = ajv.compile(modifyPosting)
  const validationResult = modifyPostingValidator(req.body)
  // console.log(validationResult)
  const isEmpty = Object.keys(req.body).length === 0

  if (validationResult && !isEmpty) {
    next()
  } else {
    res.sendStatus(400)
  }
}

const getPostingValidateMw = (req, res, next) => {
  if (foundPosting) {
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
      res.json(foundPosting)
      /* console.log(
        'no parameters given, total amount of postings: ',
        postings.length
      ) */
    }
  } else {
    // Jos postauksia ei ole olemassa
    res.sendStatus(404)
  }
}

module.exports = {
  newPostingValidateMw,
  getPostingValidateMw,
  modifyPostingValidateMw,
}
