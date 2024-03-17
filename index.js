const http = require("http");
const express = require("express");
const app = express();
const connectToDatabase = require("./databaseConnection");
const contentRouter = require("./routes/contentRoutes");
const targetRouter = require("./routes/targetLinkRoutes");
const recordRouter = require("./routes/recordRoutes");

connectToDatabase();

//MIDDLEWARES
app.use(express.json());
app.use("/content", contentRouter);
app.use("/targetlink", targetRouter);
app.use("/record", recordRouter);

//ROUTES

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
