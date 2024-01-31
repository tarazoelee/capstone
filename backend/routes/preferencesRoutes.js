const express = require("express");
const app = express();

const usersModel = require("../models/Users");

//ADDING USER PREFERNECES TO USER ON SIGNUP
app.post("/postPrefs", async (req, resp) => {
  try {
    console.log("here")
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

app.get("/getUserLength", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    const user = await usersModel.findOne({ email: userEmail }, "length");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const length = user.length;

    if (length == null) {
      return res.status(404).send("Length not set for user");
    }

    res.json({ length: length });
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

module.exports = app;
