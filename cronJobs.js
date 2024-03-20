const cron = require("node-cron");
const { start } = require("./controllers/appLogicController"); // replace with actual file and function

exports.job1 = cron.schedule(
  process.env.CRON_TIMER,
  () => {
    console.log("Running job1 every minute");
    start();
  },
  {
    scheduled: false,
  }
);
