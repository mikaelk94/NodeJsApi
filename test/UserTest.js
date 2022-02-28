const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
const serverAddress = 'http://localhost:3000'

// Vastausten validointiin käytetyt schemat
const getPostingsArraySchema = require('../schemas/user-schemas/register.schema.json')

chai.use(chaiJsonSchemaAjv)
chai.use(chaiHttp)

let user = {
  username: 'Testi',
  password: 'salasana',
  firstName: 'Testi',
  lastName: 'Testi',
  email: 'users@example.com',
  phoneNum: '045-2098621',
  dateOfBirth: '1997-10-31',
  emailVerified: true,
  createDate: '2019-08-24',
}

describe('Users', () => {
  before(() => {
    server.startDev()
  })
  after(() => {
    server.close()
  })

  //uuden käyttäjän luonti
  describe('POST /users', () => {
    it('create new user when data is correct', function (done) {
      chai
        .request(serverAddress)
        .post('/users')
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          done()
        })
    })
    it('should reject request if email is taken', function (done) {
      chai
        .request(serverAddress)
        .post('/users')
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(409)
          done()
        })
    })
    it('should reject requests with missing fields from data structure', function (done) {
      chai
        .request(serverAddress)
        .post('/users')
        .send({
          username: '',
          //password missing
          firstName: 'Testi',
          lastName: '',
          email: 'user@example.com',
          phoneNum: '045-2098621',
          dateOfBirth: '1997-10-31',
          emailVerified: true,
          createDate: '2019-08-24',
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
        .post('/users')
        .send({
          username: 1,
          password: 2,
          firstName: 'Testi',
          lastName: null,
          email: 'user@example.com',
          phoneNum: '045-2098621',
          dateOfBirth: '1997-10-31',
          emailVerified: true,
          createDate: '2019-08-24',
        })
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          done()
        })
    })
    it('should reject empty post request', function (done) {
      chai
        .request(serverAddress)
        .post('/users')
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          done()
        })
    })
  })
})
