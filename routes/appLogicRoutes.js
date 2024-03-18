const express = require("express");
const router = express.Router();
const appLogicController = require("../controllers/appLogicController");

router.route("/run-operation").get(appLogicController.runOperation);
module.exports = router;
