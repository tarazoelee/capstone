const express = require("express");
const app = express();
const OpenAI = require("openai");
require("dotenv").config();

const usersModel = require("../models/Users");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summary", async (req, res) => {
  try {
    messageToProcess = req.body.message;
    const articleInfo = `${messageToProcess}`;
    const message =
      `CONTEXT: Put the following articles into an interesting news format that summarizes the articles and can be read by one person. This is the information that you must summarize:` +
      articleInfo;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: message,
        },
      ],
      temperature: 0,
      max_tokens: 1000,
    });
    res.send(response);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/test", async (req, res) => {
  getTopicCombinations()
    .then((combinations) => console.log(combinations))
    .catch((error) => console.error(error));
  res.status(200).send("Console Has The Array Displayed");
});

//Get all combinations of topics + length for user podcasts
async function getTopicCombinations() {
  try {
    //fetch all users
    const users = await usersModel.find({});

    // Map to store unique combinations of topics and length
    const combinations = new Map();

    // Iterate over each user
    users.forEach((user) => {
      // Sort topics to ensure that the order is consistent for comparison
      const sortedTopics = user.topics.sort();

      // Create a unique key by joining sorted topics and length
      const key = `${sortedTopics.join("|")}|${user.length}`;

      // Add the unique key to the map if it doesn't exist
      if (!combinations.has(key)) {
        combinations.set(key, {
          topics: sortedTopics,
          length: user.length,
          users: [user.email],
        });
      } else {
        //If the key already exists, add the current user to the users array of the existing object
        const uniqueKey = combinations.get(key);
        uniqueKey.users.push(user.email);
      }
    });

    // Convert the Map to an array of values to get unique combinations
    return Array.from(combinations.values());
  } catch (error) {
    console.error(error);
    throw new Error("Unable to get topic combinations");
  }
}

module.exports = app;
