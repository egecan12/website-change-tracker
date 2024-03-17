const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");

router.route("/fetch").get(recordController.fetchRecords);

module.exports = router;
