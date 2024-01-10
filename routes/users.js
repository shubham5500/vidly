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
    console.log({ createdUser, user });
    return res.status(200).send(createdUser);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
