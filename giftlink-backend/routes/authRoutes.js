const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret';

router.post('/register', async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All registration fields are required' });
        }

        const db = await connectToDatabase();
        const users = db.collection('users');
        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(409).json({ error: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await users.insertOne({
            firstName,
            lastName,
            email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
        });

        const authtoken = jwt.sign({ user: { id: result.insertedId } }, JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ authtoken, email, userName: firstName });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const users = db.collection('users');
        const currentUser = await users.findOne({ email: req.body.email });

        if (!currentUser || !(await bcrypt.compare(req.body.password || '', currentUser.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const authtoken = jwt.sign({ user: { id: currentUser._id } }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ authtoken, userName: currentUser.firstName, userEmail: currentUser.email });
    } catch (error) {
        next(error);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const email = req.headers.email;
        if (!email) return res.status(400).json({ error: 'Email header is required' });

        const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
        if (!token) return res.status(401).json({ error: 'Authorization token is required' });
        jwt.verify(token, JWT_SECRET);

        const db = await connectToDatabase();
        const users = db.collection('users');
        const currentUser = await users.findOne({ email });
        if (!currentUser) return res.status(404).json({ error: 'User not found' });

        const updatedUser = await users.findOneAndUpdate(
            { email },
            { $set: { firstName: req.body.name || currentUser.firstName, updatedAt: new Date().toISOString() } },
        );
        res.json({ email: updatedUser.email, userName: updatedUser.firstName });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
