const express = require('express');
const connectToDatabase = require('../models/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gift = await collection.findOne({ id: req.params.id });

        if (!gift) return res.status(404).json({ error: 'Gift not found' });
        res.json(gift);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const result = await collection.insertOne(req.body);
        res.status(201).json({ ...req.body, _id: result.insertedId });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
