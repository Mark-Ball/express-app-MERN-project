// require('./setup');
// const supertest = require('supertest');
// const app = require('./../app');
require('dotenv').config();
const dbConnect = require('./../database/connect');
const { assert, expect } = require('chai');
const UserModel = require('./../database/models/user_model');

describe('Check Mocha is working in users_controller.test', function(done){
    it('true is true', () => {
        expect(true).to.be.true;
    })
})

describe('User registration tests', function() {
    let mongoose;

    before(async function() {
        mongoose = await dbConnect();
        console.log('db connected');
    })

    after(async function() {
        await mongoose.connection.close();
        console.log('db connection closed');
    })

    it.only('a user written to the database can be retrieved by a search', async function() {
        const userEmail = 'test@gmail.com';
        const { _id } = await UserModel.create({ email: userEmail, password: 'qwerty' });
        const { email } = await UserModel.findById(_id)
        expect(email).to.equal(userEmail);
    })

    // test('user can be created in db', async () => {
    //     const response = await supertest(app)
    //         .post('/newuser')
    //         .send({
    //             email: 'mark@test.com',
    //             password: 'qwerty'
    //         })
    //         .expect(200);
    // })

    // test('user is not approved even if falsified information sent in http request', () => {

    // })
})



/*
describe('login tests', () => {
    test('user login succeeds with correct details', () => {

    })

    test('user login fails with no details', () => {

    })

    test('user login fails with incorrect password', () => {

    })
})
*/