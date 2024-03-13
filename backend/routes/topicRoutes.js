const express = require("express");
const app = express();

const topicsModel = require("../models/topics");
const usersModel = require("../models/Users");

//GETTING ALL TOPICS
app.get("/", async (req, res) => {
  try {
    const topics = await topicsModel.find().sort({topic:1});
    res.send(topics);
  } catch (e) {
    console.log("unable to get topics");
  }
});

module.exports = app;
