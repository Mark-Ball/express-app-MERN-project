const supertest = require('supertest');
const app = require('./../app');
const dbConnect = require('./../database/connect');
const { expect } = require('chai');
const UserModel = require('./../database/models/user_model');
const FileModel = require('./../database/models/file_model');

let mongoose;

// before running the tests, connect to the db and create 1 user and 1 admin
before(async function() {
    // await FileModel.create({ name: 'test file', tags: { solution: 'Other'}, location: '1580861135309.pdf' });
    mongoose = await dbConnect();
});

// after running the tests, delete all users from the db and close the connection
after(async function() {
    await mongoose.connection.close();
});

describe('PDF display functionality', function() {
    it('PDF show returns 400 if search string invalid', async function() {
        const response = await supertest(app)
            .get('/file/12345.pdf');

        expect(response.status).to.equal(400);
    });
});

describe('Search files functionality', function() {
    it('Files can be retrieved by search', async function() {
        const response = await supertest(app)
            .post('/category')
            .send({ 
                queryBenefits: '',
                querySolution: ['AAC/ADCLOUD'],
                queryPrereqs: ''
            });

        expect(response.status).to.equal(200);
    });
});