require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');
const { loadData } = require('./util/import-mongo');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = Number(process.env.PORT || 3060);

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger: pinoLogger }));

app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ name: 'GiftLink API', status: 'ok' });
});

app.use((err, req, res, next) => {
    req.log.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
    await connectToDatabase();
    await loadData();
    return app.listen(port, () => {
        pinoLogger.info(`GiftLink API running on port ${port}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        pinoLogger.error(error);
        process.exit(1);
    });
}

module.exports = { app, startServer };
