const pino = require('pino');

let logger;

if (process.env.NODE_ENV !== 'production') {
    logger = pino({
        level: process.env.LOG_LEVEL || 'debug',
        transport: {
            target: "pino-pretty",
        },
    });
} else {
    logger = pino({ level: process.env.LOG_LEVEL || 'info' });
}

module.exports = logger;
