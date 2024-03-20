const cron = require("node-cron");
const { start } = require("./controllers/appLogicController"); // replace with actual file and function

if (process.env.CRON_TIMER) {
  exports.job1 = cron.schedule(
    process.env.CRON_TIMER,
    () => {
      console.log("Running job1");
      start();
    },
    {
      scheduled: false,
    }
  );
} else {
  console.log("CRON_TIMER is not set. The job will not run.");
}
