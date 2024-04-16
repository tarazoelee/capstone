const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// Import routes
const userRoutes = require("./routes/userRoutes");
const topicRoutes = require("./routes/topicRoutes");
const prefRoutes = require("./routes/preferencesRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const { sendContactEmail } = require("./contactFormHandler");

const app = express();

//app.get("/", (req, res) => res.status(200).json({ message: "Hello World" }));

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB URI
const mongoURI =
  "mongodb+srv://azhitkev:dltImV1IGgFvxXje@capstone.8mdcviu.mongodb.net/capstoneDB";

// Connect to MongoDB with the default connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB with default connection");
    // All Mongoose operations will use this default connection.

    // Init gfs using the default connection
    const db = mongoose.connection.db;
    gfs = Grid(db, mongoose.mongo);
    gfs.collection("uploads");

    // Start the Express server after the database connection is open
    app.listen(5001, () => {
      console.log("Server started on port 5001");
    });
  })
  .catch(console.error);

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        //this is where we are going to need to add fields for corresponding users & topics
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "podcastData",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// Contact form endpoint
app.post("/send-contact-email", async (req, res) => {
  try {
    const result = await sendContactEmail(req.body.email, req.body.message);
    res.status(result.status === "success" ? 200 : 500).send(result.message);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Audio upload endpoint
app.post("/upload", upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // If you need to perform any async operation with req.file, do it here.
    // Otherwise, just send the response.
    res.status(200).json({ file: req.file });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
});

// //find a podcasts
// app.get("/find", (req, res) => {
//   //
// });

// Use routes
app.use("/users", userRoutes);
app.use("/topics", topicRoutes);
app.use("/pref", prefRoutes);
app.use("/scraper", scraperRoutes);
app.use("/chat", chatbotRoutes);
app.use("/scripts", scriptRoutes);

// Error handling for unsupported routes
app.use((req, res, next) => {
  res.status(404).send("Request Not Found");
});
