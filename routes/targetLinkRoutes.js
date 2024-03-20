const express = require("express");
const router = express.Router();
const targetLinkController = require("../controllers/targetLinkController");

//To prevent the random users to send a request to my API, I created a secret key on my env
//So this route is expecting a "x-secret-key" for authantication
router.route("/add").post((req, res, next) => {
  const secretKey = req.headers["x-secret-key"] || req.body.secretKey;

  if (secretKey !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  targetLinkController.saveTargetLink(req, res, next);
});
router.route("/delete").delete(targetLinkController.deleteTargetLink);

module.exports = router;
