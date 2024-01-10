// To connect with your mongoDB database
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://azhitkev:dltImV1IGgFvxXje@capstone.8mdcviu.mongodb.net/",
    {
      dbName: "capstoneDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected Successfully"))

  .catch((err) => {
    console.error(err);
  });

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
const topicsModel = require("./models/topics");
const usersModel = require("./models/Users");
console.log("App listen at port 5001");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://loacalhost:5001

  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://loacalhost:5001

  // If you see App is working means backend working properly
});

//GETTING ALL TOPICS
app.get("/topics", async (req, res) => {
  try {
    const topics = await topicsModel.find({});
    res.send(topics);
  } catch (e) {
    console.log("unable to get topics");
  }
});

app.listen(5001);

//ADDING NEW USER ON SIGN UP
app.post("/addUser", async (req, resp) => {
  const email = req.body.email;
  var checkEmail = usersModel.find({ email: email });

  var user = new usersModel({
    email: email,
  });
  if ((await checkEmail).length <= 0) {
    user
      .save()
      .then(() => {
        console.log("New user created: " + email);
      })
      .catch((err) => {
        console.log("Unable to create new user" + "\n" + err);
      });
  } else {
    console.log("User already exists");
  }
});

//-----------ADDING TOPICS TO USER WHEN CREATING PROFILE--------
app.post("/selectTopic1", async (req, resp) => {
  try {
    var topic = req.body.topic;
    var email = req.body.email;
    String(topic);
    String(email);

    const query = { email: email };
    const options = { upsert: true };

    //Updating topic 1
    (
      await usersModel.updateOne(query, { $set: { topic_1: topic } }, options)
    ).then(console.log("updated topic 1 " + topic));
  } catch (e) {
    resp.send("Unable to add topic");
  }
});

app.post("/selectTopic2", async (req, resp) => {
  try {
    var topic = req.body.topic;
    var email = req.body.email;
    String(topic);
    String(email);

    const query = { email: email };
    const options = { upsert: true };

    (
      await usersModel.updateOne(query, { $set: { topic_2: topic } }, options)
    ).then(console.log("updated topic 2" + topic));
  } catch (e) {
    resp.send("Unable to add topic");
  }
});

app.post("/selectTopic3", async (req, resp) => {
  try {
    var topic = req.body.topic;
    var email = req.body.email;
    String(topic);
    String(email);

    const query = { email: email };
    const options = { upsert: true };

    (
      await usersModel.updateOne(query, { $set: { topic_3: topic } }, options)
    ).then(console.log("updated topic 3 " + topic));
  } catch (e) {
    resp.send("Unable to add topic");
  }
});

app.get("/getUserTopics", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    const user = await usersModel.findOne(
      { email: userEmail },
      "topic_1 topic_2 topic_3"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create an array of topics
    const topics = [user.topic_1, user.topic_2, user.topic_3];

    // Filter out any undefined or null values in case some topics are not set
    const filteredTopics = topics.filter((topic) => topic != null);

    res.json(filteredTopics);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/updatePreferences", async (req, resp) => {
  const { email, topic1, topic2, topic3 } = req.body;

  if (!email || !topic1 || !topic2 || !topic3) {
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

    await user.save();

    resp.send("User preferences updated successfully.");
  } catch (error) {
    console.error(error);
    resp.status(500).send("Server error");
  }
});
