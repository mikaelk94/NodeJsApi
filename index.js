const express = require('express')
const bodyParser = require('body-parser')
const users = require('./routes/users').router
const postings = require('./routes/postings')
const login = require('./routes/login')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/users', users)
app.use('/postings', postings)
app.use('/login', login)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
