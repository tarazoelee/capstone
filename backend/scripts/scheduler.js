const schedule = require("node-schedule");
const { scrapeURLs } = require("../routes/scraperRoutes");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

async function connectToMongoDB() {
  const mongoURI =
    "mongodb+srv://azhitkev:dltImV1IGgFvxXje@capstone.8mdcviu.mongodb.net/capstoneDB";
  try {
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
      })
      .catch(console.error);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Function to schedule jobs
async function scheduleJobs() {
  const twoMinutesLater = new Date(new Date().getTime() + 1 * 60000);

  const job = schedule.scheduleJob(twoMinutesLater, async function () {
    console.log("Task is running once, 2 minutes from when it was scheduled!");
    await scrapeURLs(); // Assuming scrapeURLs is an async function
    console.log("Done scraping URLs.");
  });
}

// Main function to run your script
async function main() {
  await connectToMongoDB(); // Ensure MongoDB connection is established
  scheduleJobs(); // Then schedule the jobs
}

main().catch(console.error);
