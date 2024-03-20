require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const connectToDatabase = require("./databaseConnection");
const targetRouter = require("./routes/targetLinkRoutes");
const appLogicRouter = require("./routes/appLogicRoutes");
const { errorHandler } = require("./utils/errorHandler");
const { job1 } = require("./cronJobs");

//Checks if all the process envs are set
const requiredEnvVars = [
  "DB_URI",
  "SENDGRID_API_KEY",
  "SENDGRID_SENDER",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "SPREADSHEET_ID",
  "SPREADSHEET_KEYFILE_NAME",
  "SPREADSHEET_RANGE",
  "EMAIL_RECEIVER_ADDRESS",
  "SMS_RECEIVER_NUMBER",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

connectToDatabase();

//MIDDLEWARES
app.use(express.json());

//ROUTERS
app.use("/targetlink", targetRouter);
app.use("/api", appLogicRouter);
app.use(errorHandler);

//ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to Website Change Tracker API");
});

//CRONJOB
//If CRON_TIMER env variable is not set, cron will not run
if (process.env.CRON_TIMER) {
  job1.start();
}

//SERVER
const server = http.createServer(app);

// Sets the server's port and host using environment variables, with defaults of 8000 and '127.0.0.1' respectively.
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "127.0.0.1";

server.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${HOST}:${PORT}`);
});
