const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const topicModels = require("../models/TopicTables");

//Alex's lex.zhch@gmail.com email signed up with for api key
const apiKey = "CUgtOGvuEA1d6ui3ezLWhyDgSJe6ddy8TyPsaNN7";
const todaysDate = new Date().toISOString().split("T")[0];

function getTodaysDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
  return today;
}

function getTodaysDateInISO() {
  const today = new Date();
  const isoDate = today.toISOString().split("T")[0]; // Extract only the date part
  return isoDate;
}

function getLastWeekDate() {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days
  const isoDate = oneWeekAgo.toISOString().split("T")[0]; // Extract only the date part
  return isoDate;
}

// Route definitions
router.get("/", (req, res) => {
  res.send("Scraper endpoint");
});

//CHANGE PUBLISHED AFTER DATE LATER
const topicUrls = {
  //this link isnt great for arts i dont think
  // arts: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&search="fine-arts"&published_after=${getLastWeekDate()}`,
  // breakingnews: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us,ca&categories=general&published_after=2024-03`,
  // business: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us,ca&categories=business&published_after=${getLastWeekDate()}`,
  // canadianpolitics: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=ca&categories=politics&published_after=2024-03`,
  // canadiansports: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=ca&categories=sports&published_after=2024-03`,
  // collegebasketball: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=sports&search="college basketball"&published_after=2024-03-14`,
  // collegefootball: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=sports&search="college football"&published_after=2024-03`,
  // economy: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&search="economy"&published_after=2024-03-14`,
  health: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=health&published_after=${getLastWeekDate()}&published_before=${getTodaysDateInISO()}`,
  // international: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&search="international"&published_after=2024-03-14`,
  // mlb: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=sports&search="basketball"&published_after=${getLastWeekDate()}`,
  nba: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=sports&search="NBA"&published_after=${getLastWeekDate()}`,
  // ncaa: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&categories=sports&search="ncaa"&published_after=${getLastWeekDate()}`,
  // nhl: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us,ca&categories=sports&search="NHL"&published_after=${getLastWeekDate()}`,
  // nfl: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=sports&search="NFL"&published_after=${getLastWeekDate()}`,
  technology: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=tech&search="technology"&published_after=${getLastWeekDate()}`,
  // topstories: `https://api.thenewsapi.com/v1/news/top?locale=us,ca&language=en&api_token=${apiKey}&search="headlines"&published_after=2024-03-14`,
  // uspolitics: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&locale=us&categories=politics&published_after=2024-03-14`,
  // worldnews: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&search="world"&published_after=2024-03-14`,
};

//topic (:t) in url param needs to be an exact match of the table name (all lowercase)
router.get("/topic/", async (req, res) => {
  try {
    scrapeURLs();
    res.send("topic scrapred and stored");
  } catch (error) {
    console.error("Error fetching and parsing articles:", error);
    res.status(500).send("Internal server error");
  }
});

async function scrapeURLs() {
  //for loop for each topic and url
  for (let [topic, url] of Object.entries(topicUrls)) {
    try {
      const articleContents = [];
      const response = await axios.get(url);
      for (let i = 0; i < response.data.data.length; i++) {
        console.log("its getting inside of here");
        article_url = response.data.data[i].url;
        const articleResponse = await axios.get(article_url);
        const dom = new JSDOM(articleResponse.data, { url: article_url });
        const readabilityArticle = new Readability(dom.window.document).parse();
        articleContents.push(readabilityArticle.textContent);
      }
      const todaysDate = new Date().toISOString().split("T")[0];
      putScrapedNewsIntoDB(topic, articleContents, todaysDate);
      console.log("put everything into the db");
      console.log("RESP OB", response.data.data[0]);
      console.log("RESP OB", response.data.data[1]);
      console.log("RESP OB", response.data.data[2]);
    } catch (error) {
      console.error("Error fetching and parsing articles:", error);
    }
  }
}

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

module.exports = { router, scrapeURLs };
