const express = require("express");
const app = express();

const usersModel = require("../models/Users");

//ADDING NEW USER ON SIGN UP
app.post("/addUser", async (req, res) => {
  const email = req.body.email;
  var checkEmail = usersModel.find({ email: email });

  var user = new usersModel({
    email: email,
  });
  if ((await checkEmail).length <= 0) {
    user
      .save()
      .then(() => {
        console.log("New user created: " + email);
      })
      .catch((err) => {
        console.log("Unable to create new user" + "\n" + err);
      });
  } else {
    console.log("User already exists");
  }
});

module.exports = app;
