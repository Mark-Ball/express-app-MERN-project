const app = require('./app');

const dbConnect = require('./database/connect');
dbConnect();

app.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`) });