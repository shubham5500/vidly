const express = require("express");
const mongoose = require("mongoose");
const { Users, validateUser } = require("../models/users");

const router = express.Router();

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
    const createdUser = await user.save(); 

    // here we are creating jwt token with the help of sign() method which expects a payload and a 
    // private key to encrypt the token. Side note: The private key should not be placed
    // in the code for security reasons. It should be placed in environment variable.
    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    return res.status(200).header('x-auth-token', token).send({
        name: createdUser.name,
        email: createdUser.email,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
