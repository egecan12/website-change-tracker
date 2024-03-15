const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router
  .route("/")
  .get(contentController.fetchUrlContent)
  .post(contentController.addUrlContent);

module.exports = router;
