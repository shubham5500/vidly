const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Users, validateUser } = require("../models/users");
const { error } = require("../utils/error.util");
const { authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", authorize, async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("No user found with this ID");
    }
    console.log(user);

    res.status(200).send(user);
  } catch (e) {
    error(req, res, e);
  }
});

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

    // here the password will get hashed with the help
    // of the pre-save hook implemented in the model file.
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
