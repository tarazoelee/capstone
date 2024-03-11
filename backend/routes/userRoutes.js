const express = require("express");
const app = express();
const usersModel = require("../models/Users");

//ADDING NEW USER ON SIGN UP
app.post("/addUser", async (req, res) => {
  const userEmail = req.body.email;

  var checkEmail = usersModel.find({ email: userEmail });

  try {
    var user = new usersModel({
      email: userEmail,
    });
    if ((await checkEmail).length <= 0) {
      user
        .save()
        .then(() => {
          res.status(200).send(userEmail + " added to Users Table");
        })
        .catch((err) => {
          res.status(400).send(userEmail + " could not be created");
        });
    } else {
      res.status(400).send(userEmail + " already exists");
    }
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

module.exports = app;
