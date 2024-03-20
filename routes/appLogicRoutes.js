// This module sets up the routing for the application logic. It exports a router that handles a GET request to the '/run-operation' endpoint by calling the 'runOperation' method from the appLogicController.

const express = require("express");
const router = express.Router();
const appLogicController = require("../controllers/appLogicController");

router.route("/run-operation").get(appLogicController.runOperation);
module.exports = router;
