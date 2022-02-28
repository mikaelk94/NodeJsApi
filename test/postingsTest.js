const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
const serverAddress = 'http://localhost:3000'
let userId, postingId
require('./LoginTest')

// Vastausten validointiin käytetyt schemat
const getPostingsArraySchema = require('../schemas/posting-schemas/responses/getPostingArray.schema.json')

chai.use(chaiJsonSchemaAjv)
chai.use(chaiHttp)

let posting = {
  userId: '',
  postingId: '',
  title: 'Example posting',
  description: 'example',
  category: 'MochaTesti',
  location: 'Oulu',
  images: [],
  price: '1000',
  date: '2022-01-27',
  deliveryType: {
    shipping: true,
    pickup: true,
  },
  contactInfo: {
    firstName: 'example',
    lastName: 'example',
    phoneNum: '045-2098621',
    email: 'user@example.com',
  },
}

let user = {
  username: 'Testi',
  password: 'salasana',
  firstName: 'Testi',
  lastName: 'Testi',
  email: 'postings@example.com',
  phoneNum: '045-2098621',
  dateOfBirth: '1997-10-31',
  emailVerified: true,
  createDate: '2019-08-24',
}

describe('Postings', () => {
  before(() => {
    server.startDev()
  })
  after(() => {
    server.close()
  })

  // Postauksien haku
  describe('GET /postings', () => {
    it('should return all postings', (done) => {
      // send http request
      chai
        .request(serverAddress)
        .get('/postings')
        .end((err, res) => {
          // check response status
          expect(err).to.be.null
          expect(res).to.have.status(200)

          // validate the response data structure
          expect(res.body).to.be.jsonSchema(getPostingsArraySchema)

          done()
        })
    })
  })

  // Uuden postauksen luonti
  describe('POST /postings', function () {
    it('create new user for posting tests', function (done) {
      chai
        .request(serverAddress)
        .post('/users')
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          userId = res.body.userId
          done()
        })
    })
    it('should login with correct username and password', function (done) {
      chai
        .request(serverAddress)
        .post('/login')
        .auth('Testi', 'salasana')
        .send()
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          token = res.body.token
          done()
        })
    })
    it('should create new posting when data is correct', function (done) {
      chai
        .request(serverAddress)
        .post(`/postings/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(posting)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          postingId = res.body.postingId
          done()
        })
    })
    it('should reject request with missing fields from data structure', function (done) {
      chai
        .request(serverAddress)
        .post(`/postings/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          userId: '',
          postingId: '',
          // title is missing
          description: 'example',
          category: 'Konsolit',
          location: 'Oulu',
          images: [{}],
          price: '1000',
          date: '2022-01-27',
          deliveryType: {
            shipping: true,
            pickup: true,
          },
          contactInfo: {
            firstName: 'example',
            lastName: 'example',
            phoneNum: '045-2098621',
            email: 'user@example.com',
          },
        })
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          done()
        })
    })
    it('should reject request with incorrect data types', function (done) {
      chai
        .request(serverAddress)
        .post(`/postings/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          userId: '',
          postingId: '',
          title: null,
          description: 'example',
          category: 'Konsolit',
          location: 'Oulu',
          images: [{}],
          price: '1000',
          date: '2022-01-27',
          deliveryType: {
            shipping: true,
            pickup: true,
          },
          contactInfo: {
            firstName: 'example',
            lastName: 'example',
            phoneNum: '045-2098621',
            email: 'user@example.com',
          },
        })
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          done()
        })
    })
    it('should reject empty post requests', function (done) {
      chai
        .request(serverAddress)
        .post(`/postings/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          done()
        })
    })
    it('should contain the created posting', function (done) {
      let assert = require('assert')
      chai
        .request(serverAddress)
        .get('/postings?category=MochaTesti')
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          let found = true
          for (p in res.body[0]) {
            if (p != 'userId' && p != 'postingId' && p == serverAddress) {
              //console.log(res.body[0][p])
              if (posting[p] != res.body[0][p]) {
                found = false
                break
              }
            }
          }
          if (!found) {
            assert.fail('Data not saved')
          }
          done()
        })
    })
  })

  // Postauksen muokkaus
  describe('PUT /postings', () => {
    it('should accept the request when data is correct', (done) => {
      chai
        .request(serverAddress)
        .put(`/postings/${userId}/${postingId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(posting)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(202)
          done()
        })
    })
    it('should reject the request if req.body is empty', (done) => {
      chai
        .request(serverAddress)
        .put(`/postings/${userId}/${postingId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send()
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          done()
        })
    })
    it('should reject the request if the posting is not found', (done) => {
      chai
        .request(serverAddress)
        .put('/postings/23/23')
        .set({ Authorization: `Bearer ${token}` })
        .send(posting)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  // Postauksen poisto
  describe('DELETE /postings', () => {
    it('should accept the request when data is correct', (done) => {
      chai
        .request(serverAddress)
        /* .delete(`/postings/${userId}/${postingId}`) */
        .delete(`/postings/1/1`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(202)
          done()
        })
    })
    it('should reject the request if the posting is not found', (done) => {
      chai
        .request(serverAddress)
        .delete('/postings/23/23')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          done()
        })
    })
  })
})
