const Ajv = require('ajv')

const ajv = new Ajv()

const newPostingValidateMw = (req, res, next) => {
  const newPosting = require('../../schemas/posting-schemas/newPosting.schema.json')
  const newPostingValidator = ajv.compile(newPosting)
  const validationResult = newPostingValidator(req.body)
  console.log(validationResult)

  if (validationResult) {
    next()
  } else {
    res.sendStatus(400)
  }
}

const modifyPostingValidateMw = (req, res, next) => {
  const modifyPosting = require('../../schemas/posting-schemas/updatePosting.schema.json')
  const modifyPostingValidator = ajv.compile(modifyPosting)
  const validationResult = modifyPostingValidator(req.body)
  console.log(validationResult)

  if (validationResult) {
    next()
  } else {
    res.sendStatus(400)
  }
}

const getPostingValidateMw = (req, res, next) => {
  const getPosting = require('../../schemas/posting-schemas/getPosting.schema.json')
  const getPostingValidator = ajv.compile(getPosting)
  const validationResult = getPostingValidator(req.query)
  console.log(validationResult)

  if (validationResult) {
    next()
  } else {
    res.sendStatus(400)
  }
}

module.exports = {
  newPostingValidateMw,
  getPostingValidateMw,
  modifyPostingValidateMw,
}
