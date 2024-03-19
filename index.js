require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const connectToDatabase = require("./databaseConnection");
const targetRouter = require("./routes/targetLinkRoutes");
const appLogicRouter = require("./routes/appLogicRoutes");
const { errorHandler } = require("./utils/errorHandler");
//Checks if all the process envs are set
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

//ROUTERS
app.use("/targetlink", targetRouter);
app.use("/api", appLogicRouter);
app.use(errorHandler);

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
