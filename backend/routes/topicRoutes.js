const express = require("express");
const router = express.Router();

const topicsModel = require("../models/topics");

//GETTING ALL TOPICS
router.get("/", async (req, res) => {
  try {
    const topics = await topicsModel.find().sort({ topic: 1 });

    res.send(topics);
  } catch (e) {
    res.status(500).send("Unable to get topics");
    console.log("Unable to get topics");
  }
});

// Abstracted function
async function getAllTopics() {
  try {
    const topics = await topicsModel.find().sort({ topic: 1 });
    return topics; // return the topics
  } catch (e) {
    console.error("Unable to get topics", e);
    throw new Error("Unable to get topics"); // throw an error that you can catch elsewhere
  }
}

module.exports = { router };
