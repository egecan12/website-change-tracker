const express = require("express");
const router = express.Router();
const targetLinkController = require("../controllers/targetLinkController");

router.route("/fetch").get(targetLinkController.fetchTargetLinks);
router.route("/add").post(targetLinkController.saveTargetLink);
router.route("/delete").delete(targetLinkController.deleteTargetLink);

module.exports = router;
