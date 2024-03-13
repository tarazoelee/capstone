const express = require("express");
const app = express();
const OpenAI = require("openai");
require("dotenv").config();

const usersModel = require("../models/Users");
const topicTablesModel = require("../models/TopicTables");

//set of unique topics selected across all the users
let uniqueTopicsSet = new Set();

//maps topics and their daily new article - key: topic, value: dailyScrapedNews
const newsArticleMap = new Map();

// Map to store unique combinations of topics and length
const combinations = new Map();

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
  try {
    const result = await getTopicCombinations();
    console.log(result);
    await getDailyScripts(uniqueTopicsSet);
    createScript();
    res.status(200).send("Console Has The Array Displayed");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

//Get all combinations of topics + length for user podcasts
async function getTopicCombinations() {
  try {
    //fetch all users
    const users = await usersModel.find({});

    // Iterate over each user
    users.forEach((user) => {
      // Sort topics to ensure that the order is consistent for comparison
      const sortedTopics = user.topics.sort();

      //adds only unique topics to the set of topics
      user.topics.forEach((topic) => uniqueTopicsSet.add(topic));

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

async function getDailyScripts(uniqueTopicsSet) {
  //FIX: THIS IS HARD CODED FOR TESTING - change to get everyday's current date
  const todaysDate = new Date("2024-03-11T04:00:00.000Z");
  try {
    //convert set to array to be able to access elements
    const uniqueTopicsArray = [...uniqueTopicsSet];

    for (let i = 0; i < uniqueTopicsArray.length; i++) {
      const topicName = uniqueTopicsArray[i].toLowerCase();
      const topicModel = topicTablesModel[topicName];
      console.log("Topic model", topicModel);

      if (!topicModel) {
        console.log(`No model found for topic: ${topicName}`);
        continue;
      }

      try {
        const todaysScript = await topicModel.findOne({
          date: todaysDate,
        });
        if (todaysScript) {
          //add to the map that contains key of topic and value of todaysScript text
          newsArticleMap.set(topicName, todaysScript.data);
          console.log(`Documents for topic '${topicName}':`, todaysScript);
        } else {
          console.log("No document matches the specific date.");
        }
      } catch (error) {
        console.error(
          `Error querying documents for topic '${topicName}':`,
          error
        );
      }
    }
    return newsArticleMap;
  } catch (e) {
    console.error(e);
    throw new Error("Unable to fetch topic scripts");
  }
}

async function createScript() {
  combinations.forEach((combination, key) => {
    console.log(`Combination Key: ${key}`);

    // Initialize a variable to hold the news data from the article map
    let aggregatedNewsData = "";

    // Iterate through each topic in the combination's topics array
    combination.topics.forEach((topic) => {
      let lowerCaseTopic = topic.toLowerCase();
      // Retrieve the news article for the topic
      const topicNewsData = newsArticleMap.get(lowerCaseTopic);

      if (topicNewsData) {
        // If there's news data for the topic, append it to the aggregated news data string
        console.log(`Found data for topic: ${topic}`);
        aggregatedNewsData += topicNewsData + "\n";
      } else {
        console.log(`No data found for topic: ${topic}`);
      }
    });

    // Here, you could do something with the aggregatedNewsData like saving it to a database, logging it, or processing it further.
    // For demonstration, let's log the aggregated news data.
    console.log(`Aggregated News Data for Combination [${key}]:`);
    console.log(aggregatedNewsData);
  });
}

module.exports = app;
