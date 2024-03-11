const express = require("express");
const app = express();

const usersModel = require("../models/Users");
const podcastsModel = require("../models/Podcasts");

//ADDING USER PREFERNECES TO USER ON SIGNUP
app.post("/postPrefs", async (req, resp) => {
  try {
    console.log("here");
    var topic1 = req.body.topic1;
    var topic2 = req.body.topic2;
    var topic3 = req.body.topic3;
    var topic4 = req.body.topic4;
    var topic5 = req.body.topic5;
    var length = req.body.length;
    var email = req.body.email;
    String(topic1);
    String(topic2);
    String(topic3);
    String(length);
    String(email);

    const query = { email: email };
    const options = { upsert: true };

    //setting preferences
    (
      await usersModel.updateMany(
        query,
        {
          $set: {
            topic_1: topic1,
            topic_2: topic2,
            topic_3: topic3,
            length: length,
          },
        },
        options
      )
    ).then(console.log("updated topics successfully"));
  } catch (e) {
    resp.send("Unable to add topic");
  }
});

app.get("/getUserLengthAndPreferences", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    const user = await usersModel.findOne(
      { email: userEmail },
      "length topic_1 topic_2 topic_3"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    const length = user.length;
    const topic1 = user.topic_1;
    const topic2 = user.topic_2;
    const topic3 = user.topic_3;

    if (length == null) {
      return res.status(404).send("Length not set for user");
    }

    if (topic1 == null) {
      return res.status(404).send("Preference #1 not set for user");
    }
    if (topic2 == null) {
      return res.status(404).send("Preference #2 not set for user");
    }
    if (topic3 == null) {
      return res.status(404).send("Preference #3 not set for user");
    }

    res.json({
      length: length,
      topic1: topic1,
      topic2: topic2,
      topic3: topic3,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/updatePreferences", async (req, resp) => {
  const { email, topic1, topic2, topic3, length } = req.body;

  if (!email || !topic1 || !topic2 || !topic3 || !length) {
    return resp.status(400).send("All fields are required.");
  }

  try {
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      return resp.status(404).send("User not found");
    }

    user.topic_1 = topic1;
    user.topic_2 = topic2;
    user.topic_3 = topic3;
    user.length = length;

    await user.save();

    resp.send("User preferences updated successfully.");
  } catch (error) {
    console.error(error);
    resp.status(500).send("Server error");
  }
});

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

module.exports = app;
