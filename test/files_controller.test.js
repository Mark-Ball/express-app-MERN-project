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
    it('PDF show returns 200 status', async function() {
        const files = await FileModel.find();
        const file = files[0].location;

        const response = await supertest(app)
            .get(`/file/${file}`);

        expect(response.status).to.equal(200);
    })

    it('PDF show returns 400 if search string invalid', async function() {
        const response = await supertest(app)
            .get('/file/12345.pdf');

        expect(response.status).to.equal(400);
    })


})