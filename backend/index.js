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

console.log("App listen at port 5001");

app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require("./routes/userRoutes");
const topicRoutes = require("./routes/topicRoutes");
const prefRoutes = require("./routes/preferencesRoutes");
const scraperRoutes = require("./routes/scraperRoutes");

// ... other app setup code (like middleware)

// Use routes
app.use("/users", userRoutes);
app.use("/topics", topicRoutes);
app.use("/pref", prefRoutes);
app.use("/scraper", scraperRoutes);

app.listen(5001);

const { sendContactEmail } = require("./contactFormHandler");

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
