const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");

router.route("/fetch").get(recordController.fetchRecords);
router.route("/show-records").get(recordController.showRecords);

module.exports = router;
