require('dotenv').config();
const express = require('express');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require('natural');

const app = express();
const port = Number(process.env.PORT || 3001);

function analyzeSentence(sentence) {
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer('English', stemmer, 'afinn');
    const sentimentScore = analyzer.getSentiment(sentence.split(' '));
    let sentiment = 'neutral';
    if (sentimentScore > 0) sentiment = 'positive';
    if (sentimentScore < 0) sentiment = 'negative';
    return { sentimentScore, sentiment };
}

app.use(express.json());
app.use(expressPino);

app.post('/sentiment', async (req, res) => {
    const { sentence } = req.body;
    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    try {
        const result = analyzeSentence(sentence);
        logger.info(`Sentiment analysis result: ${result.sentimentScore}`);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

if (require.main === module) {
    app.listen(port, () => logger.info(`Sentiment service running on port ${port}`));
}

module.exports = app;
module.exports.analyzeSentence = analyzeSentence;
