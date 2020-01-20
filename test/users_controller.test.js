// require('./setup');
const supertest = require('supertest');
const app = require('./../app');
require('dotenv').config();
const dbConnect = require('./../database/connect');
const { expect } = require('chai');
const UserModel = require('./../database/models/user_model');

let mongoose;

beforeEach(async function() {
    mongoose = await dbConnect();
    console.log('db connected');
})

afterEach(async function() {
    await mongoose.connection.close();
    console.log('db connection closed');
})

describe('Check Mocha is working in users_controller.test', function(){
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

    it('registerUser() returns 400 when called with incorrect info', async function() {
        const response = await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark2@test.com'
            })
            .expect(400);
    })
})

describe('login tests', () => {
    it('user login succeeds with correct details', async function(){
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: "qwerty"
            })
            .expect(200);
    })

    // need to re-write route so it returns 400 for a failure, not 302
    it('user login fails with no details', async function(){
        const response = await supertest(app)
            .post('/login')
            .send({})
            .expect(302);
    })

    it('user login fails with incorrect password', async function(){
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: "asdf"
            })
            .expect(302);
    })
})