const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

// router.route("/view-current").get(contentController.fetchCurrentContent);
// router.route("/view-cached").get(contentController.fetchCachedContent);
router.route("/check-cached").get(contentController.checkIfContentCached);
router.route("/save").post(contentController.saveContent);
router.route("/compare").get(contentController.compareContent);
//router.route("/").post(contentController.saveContent);

module.exports = router;
