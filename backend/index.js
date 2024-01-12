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
const { sendContactEmail } = require("./contactFormHandler");
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

//Adding User to Mongo
// ...

// app.post("/addUser", async (request, response) => {
//   try {
//     const user = new User(request.body);
// 	console.log("user"+ user)
// 	let result = await user.save();
// 	result = result.toObject();
// 	console.log(result)
//   } catch (error) {
//     response.status(500).send(error);
// 	console.log("Unable to add user")
//   }
// });

// ...

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

//-----------CONTACT FORM ENDPOINT--------
app.post("/send-contact-email", async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const result = await sendContactEmail(req.body.email, req.body.message);
    if (result.status === "success") {
      res.status(200).send(result.message);
    } else {
      res.status(500).send(result.message);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});
