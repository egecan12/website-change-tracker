const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router.route("/view").get(contentController.fetchUrlContent);
router.route("/add").post(contentController.addUrlContent);
router.route("/").post(contentController.addUrlContent);

module.exports = router;
