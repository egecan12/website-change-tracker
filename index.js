const http = require("http");
const express = require("express");
const app = express();
const connectToDatabase = require("./databaseConnection");
const contentRouter = require("./routes/contentRoutes");
const targetRouter = require("./routes/targetLinkRoutes");
const recordRouter = require("./routes/recordRoutes");
const { errorHandler } = require("./utils/errorHandler");
require("dotenv").config();

if (
  !process.env.DB_URI ||
  !process.env.SENDGRID_API_KEY ||
  !process.env.SENDGRID_SENDER ||
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_PHONE_NUMBER
) {
  console.error("Missing required environment variables");
  process.exit(1);
}

connectToDatabase();

//MIDDLEWARES
app.use(express.json());
app.use("/content", contentRouter);
app.use("/targetlink", targetRouter);
app.use("/record", recordRouter);
app.use(errorHandler);

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
