const express = require('express');
const req = require('express/lib/request')
const res = require('express/lib/response')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const app = express()
const port = 3000

app.use(bodyParser.json())

passport.use(new BasicStrategy(
  function(username, password, done){
    console.log(username + ' ' + password)
    let user = users.find(user => (user.username === username) && (bcrypt.compareSync(password, user.password)))
    if(user != undefined){
      
      done(null, {user})
    }
    else{
    done(null, false)
    }
  }
))


// Postings lista jonne postaukset tallennetaan
// Muutama hard koodattu hakemisen testaamisen helpottamiseksi
const postings =[{
  userId : 1,
  postingId: 120,
  title: "Example posting",
  description: "example",
  category: "Test",
  location: "Finland",
  images: [
    null
  ],
  price: "1000",
  postDate: "2022-01-27",
  deliveryType: {
    shipping: true,
    pickup: true
  },
  contactInfo: {
    firstName: "example",
    lastName: "example",
    phoneNum: "045-2098621",
    email: "user@example.com"
  }
},
{
  userId : 1,
  postingId: 110,
  title: "Example posting2",
  description: "example2",
  category: "Test",
  location: "Finland",
  images: [
    null
  ],
  price: "1000",
  postDate: "2022-01-27",
  deliveryType: {
    shipping: true,
    pickup: true
  },
  contactInfo: {
    firstName: "example",
    lastName: "example",
    phoneNum: "045-2098621",
    email: "user@example.com"
  }
},
{
  userId: 2,
  postingId: 10,
  title: "Example posting",
  description: "example",
  category: "Test",
  location: "Finland",
  images: [
    null
  ],
  price: "1000",
  postDate: "2022-01-27",
  deliveryType: {
    shipping: true,
    pickup: true
  },
  contactInfo: {
    firstName: "example",
    lastName: "example",
    phoneNum: "045-2098621",
    email: "user@example.com"
  }
},{
  userId : 2,
  postingId: 1,
  title: "Example posting",
  description: "example",
  category: "Test",
  location: "Finland",
  images: [
    null
  ],
  price: "1000",
  postDate: "2022-01-27",
  deliveryType: {
    shipping: true,
    pickup: true
  },
  contactInfo: {
    firstName: "example",
    lastName: "example",
    phoneNum: "045-2098621",
    email: "user@example.com"
  }
}]

// Users lista jonne tallennetaan käyttäjät
// muutama hard koodattu hakemisen testaamisen helpottamiseksi
// testId lisätty hakemisen testaamiseen, koska uuidv4 kanssa hankalampaa
const users = [{
  id: uuidv4(),
  testId: 1,
  username: "MikkoM",
  password: "salasana",
  firstName: "Mikko",
  lastName: "Majakka",
  email: "user@example.com",
  phoneNum: "045-2098621",
  dateOfBirth: "1997-10-31",
  emailVerified: true,
  createDate: "2019-08-24"
},
{
  id: uuidv4(),
  testId: 2,
  username: "MaijaM",
  password: "salasana",
  firstName: "Maija",
  lastName: "Majakka",
  email: "user@example.com",
  phoneNum: "045-2098621",
  dateOfBirth: "1997-10-31",
  emailVerified: true,
  createDate: "2019-08-24"
}]

// Tämän avulla voidaan hakea kaikki postaukset olit kirjautunut tai et
app.get('/postings' , (req, res) => {
  if(postings.length > 0){
    res.json(postings)
  }
  else{
    res.sendStatus(404)
  }
})

app.get('/user/postings/:userId', (req, res) => {
  console.log(req.params.userId)
  var tulostus =[] 
  let index = -1

    for(let i = 0; i < postings.length; i++){
      if(postings[i].userId === parseInt(req.params.userId)){
        index = i
        tulostus.push(postings[index])
      }
    }
    if(index === -1){
      res.sendStatus(404)
    }
    else{
    res.json(tulostus)
  }
})

// tällä voidaan luoda uusi käyttäjä
app.post('/users', (req, res) => {

  const salt = bcrypt.genSaltSync(6)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  const user = {
      id: uuidv4(),
      testId: 10,
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      dateOfBirth: req.body.dateOfBirth,
      emailVerified: req.body.emailVerified,
      createDate: req.body.createDate
  }

  users.push(user)
  console.log(user)
  res.sendStatus(200)
})
// tällä voidaan hakea käyttäjä id:n perusteella lähinnä omia testejä varten
app.get('/user/:testId', (req,res) => {
  let foundIndex = -1
    for(let i =0; i < users.length; i++){
        if(users[i].testId === parseInt(req.params.testId)){
          foundIndex = i;
          break;
        }
    }
    if(foundIndex === -1){
      res.sendStatus(404);
    }
    else{
      res.json(users[foundIndex]);
    }
})

app.post('/postings/:userId', passport.authenticate('basic', {session: false}), (req , res) => {
  let posting = {
    userId: parseInt(req.params.userId),
    postingId: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: req.body.category,
    images: [
      null
    ],
    price: req.body.price,
    postDate: req.body.postDate,
    deliveryType: {
      shipping: req.body.shipping,
      pickup: req.body.pickup
      },
      contactInfo: {
      firstName: req.body.firstName,
      phoneNum: req.body.phoneNum,
      lastName: req.body.lastName,
      email: req.body.email
    }
  }
  postings.push(posting)
  console.log(posting)
  res.sendStatus(200)
})

app.put('/postings/:userId/:postingId', (req, res) => {
  console.log(parseInt(req.params.userId))
  console.log(parseInt(req.params.postingId))
  let index = -1

  for(let i = 0; i < postings.length; i++){
    if(postings[i].userId === parseInt(req.params.userId) && (postings[i].postingId === parseInt(req.params.postingId))){
      index = i
      break;
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
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})