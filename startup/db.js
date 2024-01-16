const { default: mongoose } = require("mongoose");
const winston = require("winston");
const { logger } = require("../middleware/error.middleware");

const dbLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "DB.log", level: "error" }),
  ],
});
module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/vidly", { useUnifiedTopology: true })
    .then((info) => {
      dbLogger.info(info);
    })
    .catch((err) => {
      dbLogger.error(err.message);
    });
};
