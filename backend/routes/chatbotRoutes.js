const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();

const usersModel = require("../models/Users");
const topicTablesModel = require("../models/TopicTables");
const podcastScriptsModel = require("../models/PodcastScripts");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTodaysDate = () => new Date().toISOString().split("T")[0];

router.get("/test", async (req, res) => {
  try {
    const combinationsArray = await getTopicCombinations();
    const newsArticleMap = await getDailyScripts();
    await createScript(combinationsArray, newsArticleMap);
    res.status(200).send("Scripts have been processed and saved.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

async function getTopicCombinations() {
  const combinations = new Map();
  const users = await usersModel.find({});

  users.forEach((user) => {
    const sortedTopics = [...new Set(user.topics)].sort();
    const key = `${sortedTopics.join("|")}|${user.length}|${user.voice}`;

    if (!combinations.has(key)) {
      combinations.set(key, {
        topics: sortedTopics,
        length: user.length,
        users: [user.email],
        voice: user.voice,
      });
    } else {
      combinations.get(key).users.push(user.email);
    }
  });

  return Array.from(combinations.values());
}

async function getDailyScripts() {
  const newsArticleMap = new Map();
  const uniqueTopicsSet = new Set();

  const combinationsArray = await getTopicCombinations();
  combinationsArray.forEach((combination) => {
    combination.topics.forEach((topic) =>
      uniqueTopicsSet.add(topic.toLowerCase())
    );
  });

  await Promise.all(
    Array.from(uniqueTopicsSet).map(async (topicName) => {
      const topicModel = topicTablesModel[topicName];
      if (topicModel) {
        const todaysScript = await topicModel.findOne({
          date: getTodaysDate(),
        });
        if (todaysScript) {
          newsArticleMap.set(topicName, todaysScript.data);
        }
      }
    })
  );

  return newsArticleMap;
}

async function createScript(combinationsArray, newsArticleMap) {
  for (let combination of combinationsArray) {
    let aggregatedNewsData = combination.topics
      .map(
        (topic) =>
          newsArticleMap.get(topic.toLowerCase()) ||
          `No data found for topic: ${topic}`
      )
      .join("\n");

    //getting the number out of the podcast length (i.e. 2 for 2 min)
    const number = parseInt(combination.length, 10);
    //number of words to show what the length of the podcast should be. Using 150 as this is on average the number of words per minute someone speaks
    const numberOfWords = number * 200;
    const message = `CONTEXT: Put the following articles into an interesting news format that summarizes the articles and can be read by one person in a compelling way (imagine a narrator like David Attenborough) with a captivating introduction. The summary should be at LEAST ${numberOfWords} words long. This is the information that you must summarize :\n${aggregatedNewsData}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: message }],
        temperature: 0,
        max_tokens: 1000,
      });

      const newScript = new podcastScriptsModel({
        script: response.choices[0].message.content,
        date: getTodaysDate(),
        users: combination.users,
      });

      await newScript.save();
      console.log("New script saved successfully!");
    } catch (error) {
      console.error("Error saving script to database:", error);
    }
  }
}

module.exports = {
  router,
  getTopicCombinations,
  getDailyScripts,
  createScript,
};
