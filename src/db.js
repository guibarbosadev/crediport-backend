const mongodb = require('mongodb');

module.exports = async function connectToDB () {
    const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_CLUSTER_URL } = process.env;
    const URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER_URL}?retryWrites=true&w=majority`;
    const client = new mongodb.MongoClient(URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('report');
        
        console.log('Connected to database! 🥳');
    }  catch(error) {
        console.error('Oops, could not connect to database. 😕');
        console.error('Stacktrace: ', error)
    } finally {
        client.close();
    }
}