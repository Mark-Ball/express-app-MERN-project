const supertest = require('supertest');
const app = require('./../app');
require('dotenv').config();
const dbConnect = require('./../database/connect');
const { expect } = require('chai');
const UserModel = require('./../database/models/user_model');

let mongoose;

// before running the tests, connect to the db and create 1 user and 1 admin
before(async function() {
    mongoose = await dbConnect();

    await UserModel.create({
        email: 'mark@test.com',
        password: 'qwerty'
    });

    await UserModel.create({
        email: 'admin',
        password: 'admin',
        admin: true
    });
});

// after running the tests, delete all users from the db and close the connection
after(async function() {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
});

describe('User registration tests', function() {
    it('a user written to the database can be retrieved by a search', async function() {
        const userEmail = 'test@gmail.com';
        const { _id } = await UserModel.create({ email: userEmail, password: 'qwerty' });
        const { email } = await UserModel.findById(_id);

        expect(email).to.equal(userEmail);
    });

    it('POST /newuser returns 200 status when called with correct info', async function() {
        const response = await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark2@test.com',
                password: 'qwerty'
            });

        expect(response.status).to.equal(200);
    });

    it('POST /newuser returns 400 status when called with incorrect info', async function() {
        const response = await supertest(app)
            .post('/newuser')
            .send({
                email: 'mark3@test.com'
            });

        expect(response.status).to.equal(400);
    });
});

describe('Login tests', function() {
    it('POST /login received JWT with correct details', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: 'qwerty'
            });

        expect(response.status).to.equal(200);
        expect(/.*\..*\./.test(response.body)).to.be.true;     
    })

    it('POST /login fails with no details', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({});

        expect(response.status).to.equal(400);
    });

    it('POST /login fails with incorrect password', async function() {
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: '123456'
            });

        expect(response.status).to.equal(401);
    });
});

describe('Admin tests', async function() {
    it('un-registered user cannot access /users endpoint', async function() {
        const response = await supertest(app)
            .get('/users');

        expect(response.status).to.equal(401);
    });

    it('non-admin cannot access /users endpoint', async function() {
        const { body: jwt } = await supertest(app)
            .post('/login')
            .send({
                email: 'mark@test.com',
                password: 'qwerty'
            });

        const response = await supertest(app)
            .get('/users')
            .set('Authorization', 'Bearer ' + jwt)
            .send();

        expect(response.status).to.equal(401);
    });

    it('admin can access /users endpoint', async function() {
        const { body: jwt } = await supertest(app)
            .post('/login')
            .send({
                email: 'admin',
                password: 'admin'
            });

        const response = await supertest(app)
            .get('/users')
            .set('Authorization', 'Bearer ' + jwt)
            .send();

        expect(response.status).to.equal(200);
    });
});
