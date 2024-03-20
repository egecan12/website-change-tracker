const cron = require("node-cron");
const { start } = require("./controllers/appLogicController"); // replace with actual file and function

exports.job1 = cron.schedule(
  process.env.CRON_TIMER || "*/5 * * * *",
  () => {
    console.log("Running job1");
    start();
  },
  {
    scheduled: false,
  }
);
