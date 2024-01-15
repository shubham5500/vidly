// this (express-async-errors) package wraps the http handlers callback function to 
// asyncErrorMiddlerware in which ifn error happens in any callback then
// it'll throw the error to next middleware without us having to use the 
// try/catch in those callback explicitly.
require("express-async-errors");

const winston = require("winston");
require("dotenv").config();
const Joi = require("joi");

const config = require("config");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const { authorize } = require("./middleware/auth");
const errorMiddleware = require("./middleware/error.middleware");
const app = express();


if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: JWT Key is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could NOT connect to MongoDB..."));

app.use(express.json());
app.use("/api/auth", authorize, auth);
app.use("/api/users", users);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

// Error middleware
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));