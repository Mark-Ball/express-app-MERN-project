const dbConnect = require('./../database/connection');

module.exports = () => {
    let mongoose;

    beforeAll(async () => {
        mongoose = await dbConnect();
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })
}