const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: JWT Key is not defined");
    throw new Error('Something failed')
  }
};
