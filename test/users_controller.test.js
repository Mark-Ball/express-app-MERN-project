const supertest = require('supertest');
const app = require('./../app');
require('dotenv').config();
const dbConnect = require('./../database/connect');
const { expect } = require('chai');
const UserModel = require('./../database/models/user_model');

let mongoose;

before(async function() {
    mongoose = await dbConnect();
})

after(async function() {
    await mongoose.connection.close();
})

describe('Check Mocha is working in users_controller.test', function() {
    it('true is true', () => {
        expect(true).to.be.true;
    })
})

describe('User registration tests', function() {
    it('a user written to the database can be retrieved by a search', async function() {
        const userEmail = 'test@gmail.com';
        const { _id } = await UserModel.create({ email: userEmail, password: 'qwerty' });
        const { email } = await UserModel.findById(_id)
        expect(email).to.equal(userEmail);
    })

    it('registerUser() returns 200 status when called with correct info', async function() {
        const response = await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark@test.com',
                password: 'qwerty'
            })
            .expect(200);
    })

    it('registerUser() returns 400 status when called with incorrect info', async function() {
        const response = await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark2@test.com'
            })
            .expect(400);
    })
})

describe('Login tests', function() {
    it('POST /login succeeds with correct details', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: 'qwerty'
            })
            .expect(200);
    })

    it('POST /login fails with no details', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({})
            .expect(400);
    })

    it('POST /login fails with incorrect password', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: 'asdf'
            })
            .expect(401);
    })
})