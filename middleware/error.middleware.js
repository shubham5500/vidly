const { default: mongoose } = require("mongoose");
const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

logger.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost:27017/db-error",
    collection: "errors",
  })
);

function errorMiddleware(error, req, res, next) {
  /*
   levels of error:
    error
    info
    verbose
    debug
    silly
  */
  logger.error(error);

  // here we are catching all the error from the http handlers (using express-async-errors package)
  // if something fails in any request it'll be directed to this middleware.
  return res.status(500).send(error);
}

const errorDbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/db-error",
  { useUnifiedTopology: true, useNewUrlParser: true }
);

module.exports.logger = logger;
module.exports.errorDbConnection = errorDbConnection;
module.exports.errorMiddleware = errorMiddleware;
