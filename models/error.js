const { default: mongoose } = require("mongoose");
const { errorDbConnection } = require("../middleware/error.middleware");

const errorSchema = new mongoose.Schema({
  timestamp: String,
  level: String,
  message: String,
  meta: String,
});
// name of this model name and the winston model name should be same,
//to query that collection otherwise
// the query wont fetch the data correctly
const errorModel = errorDbConnection.model("errors", errorSchema);

module.exports.ErrorModel = errorModel;
