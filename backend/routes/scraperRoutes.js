const express = require("express");
const app = express();
const cheerio = require("cheerio");

const usersModel = require("../models/Users");

let urlsToScrape = [];

var nfl =
  "https://newsapi.org/v2/top-headlines?" +
  "country=us&" +
  "category=sports&" +
  "q=NFL&" +
  "sortBy=popularity&" +
  "apiKey=94b9c0081ebf421b89233a87e38b17ef";

//TEST URL
app.get("/nfl-article-urls", async (req, res) => {
  try {
    const response = await fetch(nfl);
    if (!response.ok) {
      // If the response status code is not in the 200-299 range
      throw new Error("Network response was not ok");
    }
    const newsContent = await response.json();
    console.log("news content", newsContent);

    newsContent.articles.forEach((article) => {
      urlsToScrape.push(article.url);
      console.log(article.url);
    });

    handleScrapeUrls();

    // const extractedNewsInfo = extractTitlesAndDescription(newsContent);

    // const summaryUrl = "http://localhost:5001/chat/summary";
    // try {
    //   const summaryResponse = await fetch(summaryUrl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ message: extractedNewsInfo }),
    //   });

    //   const summaryJson = await summaryResponse.json();
    //   res.send(summaryJson);
    // } catch (error) {
    //   console.error("Error fetching summary", error);
    // }
  } catch (e) {
    res.status(500).send("Error fetching NFL articles urls,", e);
  }
});

async function handleScrapeUrls() {
  const results = [];

  for (const url of urlsToScrape) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const data = await response.text();
      console.log("data", data);

      const $ = cheerio.load(data);
      const articleText = $("p").text();
      articleTexts.push({ url, articleText });
      console.log("article textssss", articleTexts);
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
      results.push({ url, error: e.message });
    }
  }
}

module.exports = app;

//https://newsapi.org/v2/everything?q=apple&from=2024-01-30&to=2024-01-30&sortBy=popularity&apiKey=94b9c0081ebf421b89233a87e38b17ef
