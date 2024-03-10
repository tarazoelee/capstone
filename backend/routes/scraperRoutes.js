const express = require("express");
const app = express();

const usersModel = require("../models/Users");
const topicModels = require("../models/TopicTables");

var nfl =
  "https://newsapi.org/v2/top-headlines?" +
  "country=us&" +
  "category=sports&" +
  "q=NFL&" +
  "sortBy=popularity&" +
  "apiKey=94b9c0081ebf421b89233a87e38b17ef";

// //TEST URL
// app.get("/nfl-articles", async (req, res) => {
//   try {
//     const response = await fetch(nfl);
//     if (!response.ok) {
//       // If the response status code is not in the 200-299 range
//       throw new Error("Network response was not ok");
//     }
//     const newsContent = await response.json();

//     const extractedNewsInfo = extractTitlesAndDescription(newsContent);

//     const summaryUrl = "http://localhost:5001/chat/summary";
//     try {
//       const summaryResponse = await fetch(summaryUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: extractedNewsInfo }),
//       });

//       const summaryJson = await summaryResponse.json();
//       res.send(summaryJson);
//     } catch (error) {
//       console.error("Error fetching summary", error);
//     }
//   } catch (e) {
//     res.status(500).send("Error fetching NFL articles,", e);
//   }
// });

//TEST URL
app.get("/nfl", async (req, res) => {
  try {
    const response = await fetch(nfl);
    if (!response.ok) {
      // If the response status code is not in the 200-299 range
      throw new Error("Network response was not ok");
    }
    const newsContent = await response.json();

    const extractedNewsInfo = extractTitlesAndContent(newsContent);
    const extractedDate = exctractDate(newsContent);
    const collectionName = "nfl";

    try {
      putScrapedNewsIntoDB(collectionName, extractedNewsInfo, extractedDate);
    } catch (e) {
      console.log(e);
    }

    res.status(200).json(extractedNewsInfo);
  } catch (e) {
    res.status(500).send("Error fetching NFL articles,", e);
  }
});

function extractTitlesAndContent(newsContent) {
  const articleInfo = newsContent.articles.map((article) => {
    return `${article.title}, ${article.content}`;
  });

  const concatenatedString = articleInfo.join("\n\n");
  return concatenatedString;
}

function exctractDate(newsContent) {
  const articleDateStr = newsContent.articles[0].publishedAt;
  const dateOnlyStr = articleDateStr.split("T")[0]; // "2024-03-09"
  const dateOnly = new Date(dateOnlyStr);
  return dateOnly;
}

async function putScrapedNewsIntoDB(
  collectionName,
  extractedNewsInfo,
  extractedDate
) {
  try {
    // Ensure the collectionName is valid and a corresponding model exists
    if (!topicModels[collectionName]) {
      console.log(`No model found for collection: ${collectionName}`);
      return; // Or throw an error
    }

    const TopicModel = topicModels[collectionName];
    const dataDocument = new TopicModel({
      date: extractedDate,
      data: extractedNewsInfo,
    });

    // Save the document in the database
    await dataDocument.save();
    console.log("Data saved successfully to", collectionName);
  } catch (error) {
    console.error("Error saving data to database:", error);
  }
}

module.exports = app;

//https://newsapi.org/v2/everything?q=apple&from=2024-01-30&to=2024-01-30&sortBy=popularity&apiKey=94b9c0081ebf421b89233a87e38b17ef
