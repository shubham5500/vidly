function errorMiddleware(error,req, res, next) {
  res.status(500).send("Something failed...");
}

 module.exports = errorMiddleware;