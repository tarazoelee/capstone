const express = require("express");
const app = express();
const OpenAI = require("openai");
require("dotenv").config();

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

module.exports = app;
