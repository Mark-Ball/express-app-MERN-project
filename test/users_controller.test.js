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
    await UserModel.deleteMany({});
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

        expect(response.status).to.equal(200);
    })

    it('registerUser() returns 400 status when called with incorrect info', async function() {
        const response = await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark2@test.com'
            })

        expect(response.status).to.equal(400);
    })
})

describe('Login tests', function() {
    it('POST /login received JWT with correct details', async function() {
        await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark2@test.com',
                password: 'asdfgh'
            })
        
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark2@test.com',
                password: 'asdfgh'
            })

        expect(response.status).to.equal(200);
        expect(/.*\..*\./.test(response.body)).to.be.true;     
    })

    it('POST /login fails with no details', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({})

        expect(response.status).to.equal(400)
    })

    it('POST /login fails with incorrect password', async function() {
        await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark3@test.com',
                password: '123456'
            })
        
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark3@test.com',
                password: 'asdf'
            })

        expect(response.status).to.equal(401);
    })
})

describe('Private route access tests', function() {
    it('Private route cannot be accessed without authorization header', async function() {
        const response = await supertest(app)
            .get('/testPrivate')

        expect(response.status).to.equal(401);
    })

    it('Private route cannot be accessed with incorrect authorization header', async function() {
        const response = await supertest(app)
            .get('/testPrivate')
            .set('Authorization', 'asdf')

        expect(response.status).to.equal(401);
    })

    it('Private route can be accessed with correct authorization header', async function() {
        await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark4@test.com',
                password: 'qwerty'
            })
        
        const { body: jwt } = await supertest(app)
            .post('/login')
            .send({
                email: 'mark4@test.com',
                password: 'qwerty'
            })
        
        const response = await supertest(app)
            .get('/testPrivate')
            .set('Authorization', 'Bearer ' + jwt)
        
        expect(response.status).to.equal(200);
    })
})
