const express = require("express");
const app = express();

const topicsModel = require("../models/topics");
const usersModel = require("../models/Users");

//GETTING ALL TOPICS
app.get("/topics", async (req, res) => {
  try {
    const topics = await topicsModel.find({});
    res.send(topics);
  } catch (e) {
    console.log("unable to get topics");
  }
});

app.get("/getUserTopics", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    const user = await usersModel.findOne(
      { email: userEmail },
      "topic_1 topic_2 topic_3"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create an array of topics
    const topics = [user.topic_1, user.topic_2, user.topic_3];

    // Filter out any undefined or null values in case some topics are not set
    const filteredTopics = topics.filter((topic) => topic != null);

    res.json(filteredTopics);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = app;
