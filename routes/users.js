const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Users, validateUser } = require("../models/users");
const { error } = require("../utils/error.util");

const router = express.Router();

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const user = await Users.findById(id);
})

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validationStatus = validateUser(req.body);
    if (validationStatus.error) {
      return res.status(400).send(validationStatus.error);
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with same email");
    }

    const user = new Users({
      email,
      name,
      password,
    });

    // here we are creating jwt token with the help of sign() method which expects a payload and a
    // private key to encrypt the token. Side note: The private key should not be placed
    // in the code for security reasons. It should be placed in environment variable.
    const token = user.generateToken();
    const createdUser = await user.save();
    return res.status(200).header("x-auth-token", token).send({
      name: createdUser.name,
      email: createdUser.email,
    });
  } catch (e) {
    error(req, res, e);
  }
});

module.exports = router;
