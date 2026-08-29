require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectToDatabase = require('../../models/db');

const filename = path.join(__dirname, 'gifts.json');
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

async function loadData({ reset = false } = {}) {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    if (reset) await collection.deleteMany({});

    const existingCount = await collection.countDocuments({});
    if (existingCount > 0) {
        console.log(`Gift collection already contains ${existingCount} documents`);
        return existingCount;
    }

    const insertResult = await collection.insertMany(data);
    console.log(`Inserted documents: ${insertResult.insertedCount}`);
    return insertResult.insertedCount;
}

if (require.main === module) {
    loadData({ reset: process.env.IMPORT_RESET === 'true' })
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { loadData };
