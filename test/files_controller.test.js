const supertest = require('supertest');
const app = require('./../app');
const dbConnect = require('./../database/connect');
const { expect } = require('chai');
const FileModel = require('./../database/models/file_model');

describe('Check Mocha is working in files_controller.test', function() {
    it('true is true', () => {
        expect(true).to.be.true;
    });
});

describe('PDF display functionality', function() {
    it('PDF show working', async () => {
        const response = await supertest(app)
            .get('/file/1580707463322.pdf')

        expect(response.status).to.equal(200)

        // expect to get a steam back
    })
})