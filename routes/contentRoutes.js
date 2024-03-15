const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router.route("/view-current").get(contentController.fetchUrlCurrentContent);
router.route("/view-cached").get(contentController.fetchUrlCachedContent);
router.route("/add").post(contentController.addUrlContent);
router.route("/").post(contentController.addUrlContent);

module.exports = router;
