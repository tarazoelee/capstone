const express = require("express");
const app = express();
const usersModel = require("../models/Users");

//ADDING NEW USER ON SIGN UP
app.post("/addUser", async (req, res) => {
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

app.get("/getVoiceTypes", async (req,res)=>{
  try{
    const voiceTypes = await usersModel.find({
      
    });
  }
  catch(e){
    res.status(400).send("Cannot get voice types from db")
  }
})

module.exports = app;
