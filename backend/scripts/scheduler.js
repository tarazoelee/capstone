const schedule = require("node-schedule");
const { scrapeURLs } = require("../routes/scraperRoutes");

function logMessage() {
  console.log("Scheduled job executed at:", new Date().toLocaleString());
}

// Calculate the date for 2 minutes from now
const twoMinutesLater = new Date(new Date().getTime() + 2 * 60000);

// Schedule the job to run once 2 minutes from now
schedule.scheduleJob(twoMinutesLater, async () => {
  await scrapeURLs();
  logMessage();
});
