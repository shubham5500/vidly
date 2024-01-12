const express = require("express");
const config = require("config");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");

const router = express.Router();

function validateLoginUser(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
  });

  return Joi.validate(req, schema);
}

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationStatus = validateLoginUser(req.body);

    if (validationStatus.error) {
      return res.status(400).send(validationStatus.error);
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Password is invalid");
    }
    // here we are creating jwt token with the help of sign() method which expects a payload and a 
    // private key to encrypt the token. Side note: The private key should not be placed
    // in the code for security reasons. It should be placed in environment variable.
    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

    res.send({token: token, id:  user._id});
  } catch (error) {
    if (error.hasOwnProperty("message"))
      return res.status(400).send(error.message);

    return res.status(400).send(error);
  }
});

module.exports = router;
