const mongoose = require("mongoose");

const TargetLinkSchema = new mongoose.Schema({
  url: String,
  urlRoot: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TargetLink = mongoose.model("TargetLink", TargetLinkSchema);

module.exports = TargetLink;
