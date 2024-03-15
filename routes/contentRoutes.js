const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router.route("/view-current").get(contentController.fetchUrlCurrentContent);
router.route("/view-cached").get(contentController.fetchUrlCachedContent);
router.route("/save").post(contentController.saveUrlContent);
router.route("/compare").get(contentController.compareContent);
//router.route("/").post(contentController.saveUrlContent);

module.exports = router;
