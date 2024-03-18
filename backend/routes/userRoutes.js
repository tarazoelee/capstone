const express = require("express");
const router = express.Router();
const usersModel = require("../models/Users");

// Route definitions
router.get("/", (req, res) => {
  res.send("Users endpoint");
});

//ADDING NEW USER ON SIGN UP
router.post("/addUser", async (req, res) => {
  const userEmail = req.body.email;

  try {
    // Use findOne to check if the email already exists
    const userExists = await usersModel.findOne({ email: userEmail });

    if (!userExists) {
      // If the user doesn't exist, create and save the new user
      const user = new usersModel({
        email: userEmail,
      });

      await user.save();
      res.status(200).send(userEmail + " added to Users Table");
    } else {
      // If the user already exists, send a 400 response
      res.status(400).send(userEmail + " already exists");
    }
  } catch (err) {
    console.error(err); // It's a good practice to log the error
    res.status(500).send("Server Error");
  }
});

module.exports = { router };
