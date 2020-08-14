const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const connectToDB = require('./db');


// Environment variables
const ENV = process.env.ENV || 'development';
dotenv.config({ path: `.env.${ENV}` });
const port = process.env.PORT || 3000;

// Setup stuff
const app = express();
connectToDB();


app.get('*', function (_req, res) {
    res.send('Hello there!');
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
