const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

function errorMiddleware(error,req, res, next) {
console.log('=========>', logger);
  // levels of error
  // error
  // info
  // verbose 
  // debug
  // silly
  logger.error(error.message, error)
  res.status(500).send("Something failed...");
}

 module.exports = errorMiddleware;