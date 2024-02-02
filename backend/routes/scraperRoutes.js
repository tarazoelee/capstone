const express = require("express");
const app = express();

const usersModel = require("../models/Users");

var nfl =
  "https://newsapi.org/v2/top-headlines?" +
  "country=us&" +
  "category=sports&" +
  "q=NFL&" +
  "sortBy=popularity&" +
  "apiKey=94b9c0081ebf421b89233a87e38b17ef";

//TEST URL
app.get("/nfl-articles", async (req, res) => {
  try {
    const response = await fetch(nfl);
    if (!response.ok) {
      // If the response status code is not in the 200-299 range
      throw new Error("Network response was not ok");
    }
    const newsContent = await response.json();
    console.log("JSON", newsContent);

    //NEED TO FIX THE PROCESSEDMESSAGE HERE TO SEND TO SUMMARY

    const summaryUrl = "http://localhost:5001/chat/summary";
    try {
      const summaryResponse = await fetch(summaryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newsContent }),
      });

      const summaryJson = await summaryResponse.json();
      console.log("Summary Response", summaryJson);
      res.send(summaryJson);
      // You can now return this summary as part of your /nfl-articles response or process it further
    } catch (error) {
      console.error("Error fetching summary", error);
      // Handle error
    }

    res.send(json);
  } catch (e) {
    console.log("unable to get topics", e);
    res.status(500).send("Error fetching NFL articles");
  }
});

module.exports = app;

//https://newsapi.org/v2/everything?q=apple&from=2024-01-30&to=2024-01-30&sortBy=popularity&apiKey=94b9c0081ebf421b89233a87e38b17ef
