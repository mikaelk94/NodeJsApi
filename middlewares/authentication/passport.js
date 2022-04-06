const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../../schemas/user')
/* const { avain } = require('../../secrets') */

/******** Middleware funktio passport-HTTP autentikointiin *********/
const { BasicStrategy } = require('passport-http')

passport.use(
  new BasicStrategy(async function (username, password, done) {
    let user = await User.findOne({ username: username })
    if (user) {
      let passwordCorrect = await bcrypt.compare(password, user.password)
      if (passwordCorrect) {
        done(null, user)
      }
    } else {
      done(null, false)
    }
  })
)

/********** Middleware funktio passport-JWT autentikointiin **********/
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.avain || avain

passport.use(
  new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    const user = User.findById(jwt_payload.userId)
    done(null, user)
  })
)

module.exports = passport
