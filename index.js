const express = require('express');
const app = express();
const routes = require('./routes/');
require('dotenv').config()
require('./database/connect');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`) });