const schedule = require("node-schedule");

const twoMinutesLater = new Date(new Date().getTime() + 1 * 60000);

const job = schedule.scheduleJob(twoMinutesLater, function () {
  console.log("Task is running once, 2 minutes from when it was scheduled!");
});
