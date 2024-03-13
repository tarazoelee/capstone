const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { Readable } = require("stream");
const File = require("./models/Image");

const app = express();

// Import routes
const userRoutes = require("./routes/userRoutes");
const topicRoutes = require("./routes/topicRoutes");
const prefRoutes = require("./routes/preferencesRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const { sendContactEmail } = require("./contactFormHandler");
const scriptRoutes = require('./routes/scriptRoutes')

// Middlewares
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
    console.log(file);

    let { fieldname, originalname, mimetype, buffer } = file;

    let newFile = new File({
      filename: file.originalname,
      contentType: file.mimetype,
      length: buffer.length,
    });

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

      newFile.id = uploadStream.id;
      let savedFile = await newFile.save();
      if (!savedFile) {
        return res.status(404).send("error occured while saving our work");
      }
      return res.send({
        file: savedFile,
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
      // Optional: Set the filename in the content disposition
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

// Use routes
app.use("/users", userRoutes);
app.use("/topics", topicRoutes);
app.use("/pref", prefRoutes);
app.use("/scraper", scraperRoutes);
app.use("/chat", chatbotRoutes);
app.use("/scripts", scriptRoutes);
