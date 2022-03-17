const User = require('../schemas/user.js')

const newUserValidateMw = async (req, res, next) => {
  try {
    const body = req.body
    if (
      !body.username ||
      !body.password ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phoneNum
    ) {
      return res.status(400).json({ error: 'missing information' })
    }
    const userExists = await User.findOne({ username: body.username })
    if (userExists) {
      return res.status(400).json({ error: 'username already taken' })
    }
  } catch (e) {
    next(e)
  }
  next()
}

module.exports = newUserValidateMw
