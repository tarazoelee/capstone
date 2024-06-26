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

//GET A SINGLEUSER
router.get("/findUser/:email", async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Use findOne to check if the email already exists
    const user = await usersModel.findOne({ email: userEmail });

    if (!user) {
      // If the user doesn't exist, send a 404 response
      res.status(404).send("User not found");
    } else {
      // If the user exists, send it back with a 200 response
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err); // It's a good practice to log the error
    res.status(500).send("Server Error");
  }
});

const getAllUsers = async () => {
  try {
    const users = await usersModel.find({}); //find all users
    return users;
  } catch (e) {
    console.log("Error fetching all users:", e);
  }
};

module.exports = { router, getAllUsers };
