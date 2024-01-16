require("./logging")();
require("dotenv").config();
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);

const express = require("express");
const app = express();

// configured route
require("./startup/routes")(app);

// starting DB connection
require("./startup/db")();

require("./config.js")();
throw new Error('dhasfiosdhfoihsdofh');
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
