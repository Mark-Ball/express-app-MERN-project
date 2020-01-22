require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

module.exports = app;