const express = require("express");
const app = express();
const cheerio = require("cheerio");
const usersModel = require("../models/Users");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

const topicModels = require("../models/TopicTables");

let urlsToScrape = [];

const topicUrls = {
  nba:
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=NBA&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef",

  ncaa:
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=ncaa&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef",

  nhl:
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=nhl&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef",

  mlb:
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=baseball&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef",
};

//topic (:t) in url param needs to be an exact match of the table name (all lowercase)
app.get("/topic/:t", async (req, res) => {
  const topic = req.params.t;

  // Check if the requested topic is valid
  if (!topicUrls.hasOwnProperty(topic)) {
    return res.status(404).send("Invalid topic");
  }

  try {
    const response = await axios.get(topicUrls[topic]);
    const articles = response.data.articles.slice(0, 3); // Take only the first three articles

    const articleContents = [];
    for (const article of articles) {
      const articleResponse = await axios.get(article.url);
      const dom = new JSDOM(articleResponse.data, { url: article.url });
      const readabilityArticle = new Readability(dom.window.document).parse();
      articleContents.push(readabilityArticle.textContent);
    }
    const todaysDate = getTodaysDate();
    putScrapedNewsIntoDB(topic, articleContents, todaysDate);
    res.send(articleContents);
  } catch (error) {
    console.error("Error fetching and parsing articles:", error);
    res.status(500).send("Internal server error");
  }
});

async function putScrapedNewsIntoDB(
  collectionName,

  articleContents,

  contentDate
) {
  try {
    if (!topicModels[collectionName]) {
      console.log(`No model found for collection: ${collectionName}`);

      return;
    }

    const TopicModel = topicModels[collectionName];

    const combinedArticleContents = articleContents.join("\n\n");

    const dataDocument = new TopicModel({
      date: contentDate,

      data: combinedArticleContents,
    });

    // Save the document in the database

    await dataDocument.save();

    console.log("Data saved successfully to", collectionName);
  } catch (error) {
    console.error("Error saving data to database:", error);
  }
}

function getTodaysDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
  return today;
}

// app.get("/nhl/today", async (req, res) => {
//   const today = getTodaysDate();
//   const nhlModel = topicModels["nhl"]; // Ensure 'nhl' is correctly defined in your topicModels

//   try {
//     const todaysContent = await nhlModel.find({
//       date: {
//         $gte: today,
//         $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than tomorrow's date
//       },
//     });

//     if (todaysContent.length === 0) {
//       return res.status(404).send("No content found for today.");
//     }

//     res.json(todaysContent);
//   } catch (error) {
//     console.error("Error fetching today's content:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// var nfl =
//   "https://newsapi.org/v2/top-headlines?" +
//   "country=us&" +
//   "category=sports&" +
//   "q=NFL&" +
//   "sortBy=popularity&" +
//   "apiKey=94b9c0081ebf421b89233a87e38b17ef";

// //TEST URL
// app.get("/nfl-article-urls", async (req, res) => {
//   try {
//     const response = await fetch(nfl);
//     if (!response.ok) {
//       // If the response status code is not in the 200-299 range
//       throw new Error("Network response was not ok");
//     }
//     const newsContent = await response.json();
//     console.log("news content", newsContent);

//     newsContent.articles.forEach((article) => {
//       urlsToScrape.push(article.url);
//       console.log(article.url);
//     });

//     handleScrapeUrls();

//     // const extractedNewsInfo = extractTitlesAndDescription(newsContent);

//     // const summaryUrl = "http://localhost:5001/chat/summary";
//     // try {
//     //   const summaryResponse = await fetch(summaryUrl, {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({ message: extractedNewsInfo }),
//     //   });

//     //   const summaryJson = await summaryResponse.json();
//     //   res.send(summaryJson);
//     // } catch (error) {
//     //   console.error("Error fetching summary", error);
//     // }
//   } catch (e) {
//     res.status(500).send("Error fetching NFL articles urls,", e);
//   }
// });

// async function handleScrapeUrls() {
//   const results = [];

//   for (const url of urlsToScrape) {
//     try {
//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
//       }

//       const data = await response.text();
//       console.log("data", data);

//       const $ = cheerio.load(data);
//       const articleText = $("p").text();
//       articleTexts.push({ url, articleText });
//       console.log("article textssss", articleTexts);
//     } catch (e) {
//       console.error(`Error fetching ${url}:`, e.message);
//       results.push({ url, error: e.message });
//     }
//   }
// }

module.exports = app;
