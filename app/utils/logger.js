const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Define transports (Console & File)
const logger = winston.createLogger({
  level: 'info', // Default logging level
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Logs to console
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/app.log') }) // Logs to file
  ],
});

module.exports = logger;
