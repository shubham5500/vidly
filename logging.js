const winston = require("winston");
const { transports } = require("winston");
const { logger } = require("./middleware/error.middleware");
// this (express-async-errors) package wraps the http handlers callback function to
// asyncErrorMiddleware in which ifn error happens in any callback then
// it'll throw the error to next middleware without us having to use the
// try/catch in those callback explicitly.
require("express-async-errors");

module.exports = function () {
  // if there is an error in the application outside the express context i.e in node environment then it wont be
  // caught until you handle it explicitly, here here are listening to that error only.

  // process.on('uncaughtException', (ex) => {
  //   console.log('WE GOT AN UNCAUGHT EXCEPTION', ex);
  //   logger.error(ex.message, ex)
  //   process.exit(1)
  // });
  logger.exceptions.handle(
    new transports.File({ filename: "exceptions.log" }),
    new transports.Console({ format: winston.format.colorize() })
  );

  // unhandled promise rejection

  // forcefully creating an error
  // const p = Promise.reject(new Error('Something failed miserably'));
  // p.then(() => {
  //   console.log('DONE!');
  // })

  // this is how you handle unhandled rejection
  // process.on('unhandledRejection', (ex) => {
  //   console.log('WE GOT AN UNCAUGHT Rejection', ex);
  //   logger.error(ex.message, ex)
  //   process.exit(1)
  // });
  // or this way:
  logger.rejections.handle(
    new transports.File({ filename: "rejections.log" }),
    new transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
};
