const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const topicModels = require("../models/TopicTables");
const apiKey = "4nRaLqvSbR1k8XjvrKLH8tzzWHwog4ccW1Tutujm";
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

//https://api.thenewsapi.com/v1/news/all?api_token${apiKey}&search="arts"&language=en&sort=relevance_score&limit=3

const topicUrls = {
  arts: `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&language=en&limit=3&search="arts"&published_after=2024-03`,
};

// const topicUrls = {
//   arts:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=entertainment&" +
//     "q=arts&" +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   //idk if 2 countries will work
//   breakingnews:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "country=ca&" +
//     "category=general&" +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   business:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=business&" +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   canadianpolitics:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=ca&" +
//     "q=politics&" +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   canadiansports:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=ca&" +
//     "category=sports&" +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   collegebasketball:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "q=college basketball" +
//     "category=sports&" +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   collegefootball:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "q=college football" +
//     "category=sports&" +
//     `${apiKey}`,

//   economy:
//     "https://newsapi.org/v2/everything?" +
//     "q=economy OR finance" +
//     "language=en&" +
//     `from=${getLastWeekDate()}&` +
//     `to=${getTodaysDateInISO()}&` +
//     "sortBy=popularity&" +
//     `${apiKey}`,

//   health:
//     "https://newsapi.org/v2/top-headlines?" +
//     "category=health&" +
//     "country=us&" +
//     `${apiKey}`,

//   international:
//     "https://newsapi.org/v2/everything?" +
//     "q=international OR world&" +
//     "sortBy=popularity&" +
//     "language=en&" +
//     `from=${getLastWeekDate()}&` +
//     `to=${getTodaysDateInISO()}&` +
//     `${apiKey}`,

//   mlb:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=sports&" +
//     "q=baseball&" +
//     `${apiKey}`,

//   nba:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=sports&" +
//     "q=NBA&" +
//     `${apiKey}`,

//   //searching in all fields for ncaa
//   ncaa:
//     "https://newsapi.org/v2/everything?" +
//     "q=ncaa&" +
//     "sortBy=popularity&" +
//     "language=en&" +
//     `from=${getLastWeekDate()}&` +
//     `to=${getTodaysDateInISO()}&` +
//     `${apiKey}`,

//   nhl:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=sports&" +
//     "q=nhl&" +
//     `${apiKey}`,

//   nfl:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=sports&" +
//     "q=nfl&" +
//     `${apiKey}`,

//   technology:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "category=technology&" +
//     `${apiKey}`,

//   topStories:
//     "https://newsapi.org/v2/top-headlines?" + "country=us&" + `${apiKey}`,

//   usPolitics:
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "q=politics&" +
//     `${apiKey}`,
// };

//topic (:t) in url param needs to be an exact match of the table name (all lowercase)
// app.get("/topic/:t", async (req, res) => {
//   const topic = req.params.t;

//   // Check if the requested topic is valid
//   if (!topicUrls.hasOwnProperty(topic)) {
//     return res.status(404).send("Invalid topic");
//   }

//   try {
//     const response = await axios.get(topicUrls[topic]);
//     const articles = response.data.articles.slice(0, 3); // Take only the first three articles

//     const articleContents = [];
//     for (const article of articles) {
//       const articleResponse = await axios.get(article.url);
//       const dom = new JSDOM(articleResponse.data, { url: article.url });
//       const readabilityArticle = new Readability(dom.window.document).parse();
//       articleContents.push(readabilityArticle.textContent);
//     }
//     const todaysDate = new Date().toISOString().split("T")[0];
//     putScrapedNewsIntoDB(topic, articleContents, todaysDate);
//     res.send(articleContents);
//   } catch (error) {
//     console.error("Error fetching and parsing articles:", error);
//     res.status(500).send("Internal server error");
//   }
// });

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

scrapeURLs();

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

// app.get("/nhl/today", async (req, res) => {
//   const today = getTodaysDate();b
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
//   `${apiKey}`;

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
