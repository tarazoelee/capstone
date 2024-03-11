const express = require("express");
const app = express();
const cheerio = require("cheerio");
const scrapeNewsContent = require('./scrape')

const usersModel = require("../models/Users");

let urlsToScrape = [];

// app.get('/api/nba/:url', async (req, res) => {
//   const url = req.params.url;
//   console.log(url);

//   if (!url) {
//     return res.status(400).json({ error: 'URL parameter is required' });
//   }
//   console.log('here')

//   const newsContent = await scrapeNewsContent(url);

//   if (newsContent) {
//     res.json({ content: newsContent });
//   } else {
//     res.status(500).json({ error: 'Failed to scrape news content' });
//   }
// });

// we need axios to make HTTP requests
const axios = require('axios');

// and we need jsdom and Readability to parse the article HTML
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');


//GETTING ALL TOPICS
app.get("/test", async (req, res) => {
  try {
   res.send("success")
  } catch (e) {
    console.log("unable to test");
  }
});

  app.get('/nba', async (req, res) => {
      const url = "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=NBA&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef";
    // Make the request with axios' get() function
    await axios.get(url).then(function(r1) {

      // At this point we will have some search results from the API. Take the first search result...
      let firstResult = r1.data.articles[0];

      // ...and download the HTML for it, again with axios
      axios.get(firstResult.url).then(function(r2) {

        // We now have the article HTML, but before we can use Readability to locate the article content we need jsdom to convert it into a DOM object
        let dom = new JSDOM(r2.data, {
          url: firstResult.url
        });

        // now pass the DOM document into readability to parse
        let article = new Readability(dom.window.document).parse();

        // Done! The article content is in the textContent property
        res.send(article.textContent)
        console.log(article.textContent);
      })
    })
})

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
