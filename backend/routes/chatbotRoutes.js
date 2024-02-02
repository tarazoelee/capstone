const express = require("express");
const app = express();
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("good with openai", openai);

app.post("/summary", async (req, res) => {
  try {
    messageToProcess = res.body;
    const message = `${messageToProcess}`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0,
      max_tokens: 1000,
    });
    console.log("RESPONSE FROM CHAT", response);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = app;
