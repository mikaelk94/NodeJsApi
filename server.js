const express = require('express')
const bodyParser = require('body-parser')
const users = require('./routes/users').router
const postings = require('./routes/postings').router
const login = require('./routes/login')
const upload = require('./routes/upload')

const app = express()
// heroku
// const port = process.env.PORT || 80
// const port = 3000

app.use(bodyParser.json())

app.use('/users', users)
app.use('/postings', postings)
app.use('/login', login)
app.use('/upload', upload)

app.get('/', (req, res) => {
  res.sendStatus(200)
})

let serverInstance = null

module.exports = {
  start: function () {
    serverInstance = app.listen(process.env.PORT || 80)
  },
  startDev: function () {
    serverInstance = app.listen(3000)
  },
  close: function () {
    serverInstance.close()
  },
}
