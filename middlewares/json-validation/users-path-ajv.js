const Ajv = require('ajv')

const ajv = new Ajv()

const newUserValidateMw = (req, res, next) => {
  const newUser = require('../../schemas/user-schemas/register.schema.json')
  const newUserValidator = ajv.compile(newUser)
  const validationResult = newUserValidator(req.body)
  //console.log(validationResult)

  if (validationResult) {
    next()
  } else {
    res.sendStatus(400)
  }
}

module.exports = { newUserValidateMw }
