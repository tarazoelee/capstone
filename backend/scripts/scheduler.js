const schedule = require("node-schedule");
const axios = require("axios");

// Schedule the task to run once a day at a specific time
// For example, every day at 2:00 AM
const job = schedule.scheduleJob(`* * * * *`, function () {
  console.log("Starting scheduled task to fetch all topics...");

  axios
    .get("http://localhost:5001/scraper/fetch-all-topics")
    .then((response) => {
      console.log("Successfully called fetch-all-topics:", response.data);
    })
    .catch((error) => {
      console.error("Error calling fetch-all-topics:", error.message);
    });
});
