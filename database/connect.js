const mongoose = require('mongoose');

async function dbConnect() {
    mongoose.connect(process.env.DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', error => console.log(error));

    return mongoose;
}

module.exports = dbConnect;
