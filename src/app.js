const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

const connectToDB = require('./db');

// Environment variables
const ENV = process.env.ENV || 'development';
dotenv.config({ path: `.env.${ENV}` });
const port = process.env.PORT || 3000;

// Setup stuff
const app = express();
app.use(bodyParser.json());
let database;

connectToDB().then((db) => {
    database = db;
    app.listen(port, function () {
        console.log(`Listening on port ${port}`);
    });
});

function reportsCollection() {
    return database.collection('report');
}

app.get('/report', async function (_req, res) {
    const report = await reportsCollection().find().toArray();
    res.json(report);
});

app.post('/report', async function (req, res) {
    try {
        const result = await reportsCollection().insertOne(req.body);
        res.json(result.ops);
    } catch {
        res.status(400);
        res.send('Could not insert the report');
    }
});

app.put('/report/:id', async function (req, res) {
    try {
        const filterQuery = { _id: mongodb.ObjectID(req.params.id) };
        const updateQuery = { $set: req.body };
        const result = await reportsCollection().updateOne(filterQuery, updateQuery);
        const didFindReport = result?.result?.n > 0;

        if (didFindReport) {
            res.send('Successfully edited report');
        } else {
            res.send('Could not find the report');
        }
    } catch {
        res.status(400);
        res.send('Could not edit the report');
    }
});

app.delete('/report/:id', async function (req, res) {
    try {
        const filterQuery = { _id: mongodb.ObjectID(req.params.id) };
        const result = await reportsCollection().deleteOne(filterQuery);
        const didFindReport = result?.result?.n > 0;
        
        if (didFindReport) {
            res.send('Successfully deleted the report');
        } else {
            res.status(400);
            res.send('Could not find the report');
        }
    } catch {
        res.status(400);
        res.send('Could not delete the report');
    }
});
