const dbConnect = require('./../database/connect');

module.exports = () => {
    let mongoose;

    beforeAll(async () => {
        mongoose = await dbConnect();
        console.log('beforeAll ran');
    })

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('afterAll ran');
    })
}