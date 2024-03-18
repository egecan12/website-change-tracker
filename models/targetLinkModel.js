const mongoose = require("mongoose");

const TargetLinkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TargetLink = mongoose.model("TargetLink", TargetLinkSchema);

module.exports = TargetLink;
