require('dotenv').config();
const { MongoClient } = require('mongodb');
const memoryDatabase = require('./memoryDb');

let dbInstance = null;
let mongoClient = null;
const dbName = 'giftdb';

async function connectToDatabase() {
    if (dbInstance) return dbInstance;

    const url = process.env.MONGO_URL || 'memory://giftlink';
    if (url.startsWith('memory://')) {
        dbInstance = memoryDatabase;
        return dbInstance;
    }

    mongoClient = new MongoClient(url);
    await mongoClient.connect();
    dbInstance = mongoClient.db(dbName);
    return dbInstance;
}

async function closeDatabase() {
    if (mongoClient) await mongoClient.close();
    mongoClient = null;
    dbInstance = null;
}

module.exports = connectToDatabase;
module.exports.closeDatabase = closeDatabase;
