const express = require("express");
const app = express();

const usersModel = require("../models/Users");
const podcastsModel = require("../models/Podcasts");
const voiceTypes = require("../models/VoiceTypes");
const Users = require("../models/Users");

//ADD USER PREFERENCES
app.post("/postPrefs", async (req, res) => {
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

app.get("/getUserCreationDate", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("require user email");
    }

    const user = await usersModel.findOne(
      { email: userEmail },
      "_id"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    const insertionDate = user._id.getTimestamp();
    // Get the year and month
    const year = insertionDate.getFullYear();
    const month = insertionDate.getMonth() + 1; // Adding 1 to convert from 0-indexed to 1-indexed month

    res.json({
      year: year, 
      month: month
    });

  } catch (error) {
    res.status(500).send("Server error");
  }
});

//GET USER PREFERENCES
app.get("/getUserLengthAndPreferences", async (req, res) => {
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
app.post("/updatePreferences", async (req, resp) => {
  const { email, topic1, topic2, topic3, length, voice} = req.body;

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
app.get("/getVoiceTypes", async (req,res)=>{
  try{
    const voices = await voiceTypes.find();
    res.send(voices);
  }
  catch(e){
    res.status(400).send("Cannot get voice types from db")
  }
})


/*
//BACKEND TO GET USER PODCASTS
app.get("/getUserPodcasts", async (req, resp) => {
  const { email } = req.query; // Changed from req.body to req.query for a GET request

  if (!email) {
    return resp.status(400).send("Email is required.");
  }

  try {
    // Find all podcasts that have the user's email in the corresponding_users array
    const podcasts = await podcastsModel
      .find({ corresponding_users: email }, "date_created topics -_id")
      .exec();

    if (podcasts.length === 0) {
      return resp.status(404).send("No podcasts found for the given user.");
    }

    // Return the podcasts and their creation dates
    return resp.status(200).json(podcasts);
  } catch (error) {
    console.error(error);
    return resp.status(500).send("Server error");
  }
});

//ADDING PODCAST TO TABLE
app.post("/addPodcast", async (req, resp) => {
  const { topic_1, topic_2, topic_3, length } = req.body;
  const audio_file = req.file; // Assuming 'audio_file' is the name of the form field for the uploaded file

  try {
    const interestedUsers = await usersModel.find({
      $or: [
        {
          $and: [
            { topic_1: topic_1 },
            { topic_2: topic_2 },
            { topic_3: topic_3 },
          ],
        },
        {
          $and: [
            { topic_1: topic_1 },
            { topic_2: topic_3 },
            { topic_3: topic_2 },
          ],
        },
        {
          $and: [
            { topic_1: topic_2 },
            { topic_2: topic_1 },
            { topic_3: topic_3 },
          ],
        },
        {
          $and: [
            { topic_1: topic_2 },
            { topic_2: topic_3 },
            { topic_3: topic_1 },
          ],
        },
        {
          $and: [
            { topic_1: topic_3 },
            { topic_2: topic_1 },
            { topic_3: topic_2 },
          ],
        },
        {
          $and: [
            { topic_1: topic_3 },
            { topic_2: topic_2 },
            { topic_3: topic_1 },
          ],
        },
      ],
    });

    //Extract user emails
    const correspondingUsersEmails = interestedUsers.map((user) => user.email);

    //Create a new podcast instance with the found corresponding users
    const newPodcast = new podcastsModel({
      date_created: new Date(),
      topic_1,
      topic_2,
      topic_3,
      length,
      audio_file_ref,
      corresponding_users: correspondingUsersEmails,
    });

    const savedPodcast = await newPodcast.save();

    resp.status(201).json(savedPodcast);
  } catch (error) {
    console.error(error);
    resp.status(500).send("Server error while adding the podcast");
  }
});
*/

module.exports = app;
