const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { Readable } = require("stream");

const app = express();
const cron = require("node-cron");

// import routes
const { router: userRoutes, getAllUsers } = require("./routes/userRoutes");
const {
  router: scriptRoutes,
  processTodaysPodcasts,
} = require("./routes/scriptRoutes");
const { router: topicRoutes } = require("./routes/topicRoutes");
const { router: prefRoutes } = require("./routes/preferencesRoutes");
const { router: scraperRoutes, scrapeURLs } = require("./routes/scraperRoutes");

const {
  router: chatbotRoutes,
  getTopicCombinations,
  getDailyScripts,
  createScript,
} = require("./routes/chatbotRoutes");

const { sendContactEmail } = require("./contactFormHandler");
const { sendPodcastToEmail } = require("./emailPodcastsHandler");

// middlewares
app.use(express.json());
app.use(cors());

let port = 5001;

app.listen(5001, () => {
  console.log(`listening on port ${port}`);
});

const uri =
  "mongodb+srv://azhitkev:dltImV1IGgFvxXje@capstone.8mdcviu.mongodb.net/capstoneDB";

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB database successfully");
  })
  .catch(() => {
    console.log(
      "error occurred while connecting to MongoDB database in the example file"
    );
  });

let connection = mongoose.connection;

connection.on("open", () => {
  console.log("connection established successfully");
  let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  app.post("/upload", upload.single("file"), async (req, res) => {
    let { file } = req;

    let { fieldname, originalname, mimetype, buffer, encoding } = file;

    // let newFile = new File({
    //   filename: file.originalname,
    //   contentType: file.mimetype,
    //   length: buffer.length,
    // });

    try {
      let uploadStream = bucket.openUploadStream(fieldname, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      let readBuffer = new Readable();
      readBuffer.push(buffer);
      readBuffer.push(null);

      const isUploaded = await new Promise((resolve, reject) => {
        readBuffer
          .pipe(uploadStream)
          .on("finish", resolve("successfull"))
          .on("error", reject("error occured while creating stream"));
      });

      //newFile.id = uploadStream.id;
      //let savedFile = await newFile.save();
      // if (!savedFile) {
      //   return res.status(404).send("error occured while saving our work");
      // }
      return res.send({
        fileId: uploadStream.id, // This is the _id in the fs.files collection
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,

        message: "file uploaded successfully",
      });
    } catch (err) {
      console.log(err);
      res.send("error uploading file");
    }
  });

  app.get("/image/:fileId", (req, res) => {
    let { fileId } = req.params;

    let downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    downloadStream.on("file", (file) => {
      // Set the proper content type
      res.set("Content-Type", file.metadata.contentType);
      // Set the filename in the content disposition
      res.set("Content-Disposition", file.filename);
    });

    downloadStream.on("error", (error) => {
      // Handle error, maybe the file doesn't exist or the ID is incorrect
      res.sendStatus(404);
    });

    downloadStream.pipe(res);
  });
});

// Contact form endpoint
app.post("/send-contact-email", async (req, res) => {
  try {
    const result = await sendContactEmail(req.body.email, req.body.message);
    res.status(result.status === "success" ? 200 : 500).send(result.message);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//-----SENDS PODCAST TO EACH USER EMAIL -------//
async function getPodcastForUserEmail() {
  let users = await getAllUsers();
  for (const user of users) {
    const response = await fetch(
      `daily-bytes-backend.vercel.app-lq9b.vercel.app/scripts/todaysScript/${user.email}`
    );
    const data = await response.json();

    const userScript = data.filter((item) => item.users[0] === user.email);
    if (userScript.length > 0) {
      let buffer = await getPodcast(userScript[0].refID); //returns a buffer of the podcast
      await sendPodcastToEmail(user.email, buffer);
      console.log("YAY");
    } else {
      console.log("No byte today... :(", user.email);
    }
  }
}

//-------GETS THE PODCAST AUDIO AS A BUFFER TO SEND OVER EMAIL -----//
async function getPodcast(refID) {
  if (!refID) return;
  try {
    const response = await fetch(
      `daily-bytes-backend.vercel.app-lq9b.vercel.app/image/${refID}`
    );
    console.log("response from refid", response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const arrayBuffer = await response.arrayBuffer(); // Convert the response to a buffer
    const buffer = Buffer.from(arrayBuffer); //convert arrayBuffer to Buffer
    return buffer;
  } catch (e) {
    console.error("There has been a problem with your fetch operation:", e);
  }
}

/** ------AUTOMATION OF SCRAPING + CREATION OF PODCASTS ----- */
// cron.schedule("0 20 * * *", async () => {
//   console.log("Scheduled task to fetch all topics");
//   try {
//     //scraping URLs and storing into the db
//     const fetched = await scrapeURLs();

//     //getting all topic combinations from the db for all users
//     const combinationsArray = await getTopicCombinations();

//     //get all the scraped news articles from the db
//     const newsArticleMap = await getDailyScripts();

//     //pass news articles through chatgpt to create proper scripts
//     await createScript(combinationsArray, newsArticleMap);

//     //gets all of todays scripts and creates podcasts
//     await processTodaysPodcasts();

//     //sends podcast to each user's email
//     getPodcastForUserEmail();
//   } catch (error) {
//     console.error("Error fetching topics in scheduled task:", error);
//   }
// });

app.post("/automation-flow", async (req, res) => {
  console.log("Scheduled task to fetch all topics");
  try {
    //scraping URLs and storing into the db
    const fetched = await scrapeURLs();

    //getting all topic combinations from the db for all users
    const combinationsArray = await getTopicCombinations();

    //get all the scraped news articles from the db
    const newsArticleMap = await getDailyScripts();

    //pass news articles through chatgpt to create proper scripts
    await createScript(combinationsArray, newsArticleMap);

    //gets all of todays scripts and creates podcasts
    await processTodaysPodcasts();

    //sends podcast to each user's email
    await getPodcastForUserEmail();

    res.status(200).send("Done");
  } catch (error) {
    console.error("Error fetching topics in scheduled task:", error);
    res.status(500).send("Error");
  }
});

// Use routes
app.use("/users", userRoutes);
app.use("/topics", topicRoutes);
app.use("/pref", prefRoutes);
app.use("/scraper", scraperRoutes);
app.use("/chat", chatbotRoutes);
app.use("/scripts", scriptRoutes);
