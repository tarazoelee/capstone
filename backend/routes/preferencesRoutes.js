const express = require("express");
const router = express.Router();

const usersModel = require("../models/Users");
const voiceTypes = require("../models/VoiceTypes");

// Route definitions
router.get("/", (req, res) => {
  res.send("Preferences endpoint");
});

//ADD USER PREFERENCES
router.post("/postPrefs", async (req, res) => {
  try {
    // Gather topic names into an array, remove any falsy values, and sort them alphabetically
    const topics = [req.body.topic1, req.body.topic2, req.body.topic3]
      .filter(Boolean)
      .sort();

    const length = String(req.body.length);
    const email = String(req.body.email);
    const voice = String(req.body.voice);

    const query = { email: email };
    const update = {
      $set: {
        topics: topics,
        length: length,
        voice: voice,
      },
    };

    // Attempt to update the user
    const result = await usersModel.updateOne(query, update);
    // Check if the user was found and updated
    if (result.matchedCount === 0) {
      // No user was found
      return res.status(404).send("User not found");
    }
    res.status(200).send("User Preferences Added Successfully");
  } catch (e) {
    console.error(e);
    res.status(500).send("Unable to add topics");
  }
});

//get user profile creation date
router.get("/getUserCreationDate", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("require user email");
    }

    const user = await usersModel.findOne({ email: userEmail }, "_id");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const insertionDate = user._id.getTimestamp();
    // Get the year and month
    const year = insertionDate.getFullYear();
    const month = insertionDate.getMonth() + 1; // Adding 1 to convert from 0-indexed to 1-indexed month

    res.json({
      year: year,
      month: month,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//GET USER PREFERENCES
router.get("/getUserLengthAndPreferences", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    const user = await usersModel.findOne(
      { email: userEmail },
      "length topics voice"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    const length = user.length;
    const topic1 = user.topics[0];
    const topic2 = user.topics[1];
    const topic3 = user.topics[2];
    const voice = user.voice;

    res.json({
      length: length,
      topic1: topic1,
      topic2: topic2,
      topic3: topic3,
      voice: voice,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//UPDATE USER PREFERENCES
router.post("/updatePreferences", async (req, resp) => {
  const { email, topic1, topic2, topic3, length, voice } = req.body;

  if (!email || !topic1 || !topic2 || !topic3 || !length || !voice) {
    return resp.status(400).send("All fields are required.");
  }

  const topicsArray = [req.body.topic1, req.body.topic2, req.body.topic3]
    .filter(Boolean)
    .sort();

  try {
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      return resp.status(404).send("User not found");
    }

    user.topics = topicsArray;
    user.length = length;
    user.voice = voice;

    await user.save();

    resp.send("User preferences updated successfully.");
  } catch (error) {
    console.error(error);
    resp.status(500).send("Server error");
  }
});

/**----GETTING VOICE TYPES----- */
router.get("/getVoiceTypes", async (req, res) => {
  try {
    const voices = await voiceTypes.find();
    res.send(voices);
  } catch (e) {
    res.status(400).send("Cannot get voice types from db");
  }
});

module.exports = { router };
