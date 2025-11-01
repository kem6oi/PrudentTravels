const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
  })
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),

  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.uncolorize(),
      winston.format.json()
    )
  }),

  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: winston.format.combine(
      winston.format.uncolorize(),
      winston.format.json()
    )
  })
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
  exitOnError: false
});

// Stream for Morgan middleware
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

module.exports = logger;
