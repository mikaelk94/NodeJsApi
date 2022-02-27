const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
const serverAddress = 'http://localhost:3000'

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

describe('Web store API tests', () => {
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
  describe('Create new posting', function () {
    it('should accept new posting when data is correct', function (done) {
      chai
        .request(serverAddress)
        .post('/postings/1')
        .send(posting)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          done()
        })
    })
    it('should reject request with missing fields from data structure', function (done) {
      chai
        .request(serverAddress)
        .post('/postings/1')
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
        .post('/postings/1')
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
        .post('/postings/1')
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
              console.log(res.body[0][p])
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
})
