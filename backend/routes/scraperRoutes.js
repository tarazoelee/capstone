const express = require("express");
const app = express();
const cheerio = require("cheerio");
const usersModel = require("../models/Users");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

let urlsToScrape = [];

//GETTING ALL TOPICS
app.get("/test", async (req, res) => {
  try {
    res.send("success");
  } catch (e) {
    console.log("unable to test");
  }
});

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
};

app.get("/nba", async (req, res) => {
  scrape(nba);
});

// app.get('/nhl', async (req, res) => {

//     scrape(nhl);
// });

app.get("/nba", async (req, res) => {
  try {
    const response = await axios.get(nba);
    const articles = response.data.articles.slice(0, 3); // Take only the first three articles

    const articleContents = [];
    for (const article of articles) {
      const articleResponse = await axios.get(article.url);
      const dom = new JSDOM(articleResponse.data, { url: article.url });
      const readabilityArticle = new Readability(dom.window.document).parse();
      articleContents.push(readabilityArticle.textContent);
    }

    res.send(articleContents);
  } catch (error) {
    console.error("Error fetching and parsing articles:", error);
    res.status(500).send("Internal server error");
  }
});

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

    res.send(articleContents);
  } catch (error) {
    console.error("Error fetching and parsing articles:", error);
    res.status(500).send("Internal server error");
  }
});

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
