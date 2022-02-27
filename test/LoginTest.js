const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
const serverAddress = 'http://localhost:3000'



chai.use(chaiHttp)

let user = {
    username: "Testi",
    password: "salasana",
    firstName: "Testi",
    lastName: "Testi",
    email: "user@example.com",
    phoneNum: "045-2098621",
    dateOfBirth: "1997-10-31",
    emailVerified: true,
    createDate: "2019-08-24"
}


describe('Web store API tests, login testing', () => {

    before(() => {
        server.startDev()
    })
    after(() => {
        server.close()
    })

    describe('POST /login', () => {
        it('create new user for login testing', function (done) {
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
        it('logins with correct username and password', function (done) {
            chai
                .request(serverAddress)
                .post('/login')
                .auth('Testi', 'salasana')
                .send()
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    done()
                })
        })
        it('login returns 401 if user is not found', function (done) {
            chai
                .request(serverAddress)
                .post('/login')
                .auth('user', 'salasana')
                .send()
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })
        })
        it('login returns 401 if password is incorrect', function (done) {
            chai
                .request(serverAddress)
                .post('/login')
                .auth('Testi', '')
                .send()
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })
        })
    })
})
