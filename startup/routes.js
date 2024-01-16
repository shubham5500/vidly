const express = require("express");
const { errorMiddleware } = require("../middleware/error.middleware");
const { authorize } = require("../middleware/auth");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require('../routes/auth')


module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", authorize, auth);
  app.use("/api/users", users);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);

  // Error middleware (winston configuration)
  app.use(errorMiddleware);
};
