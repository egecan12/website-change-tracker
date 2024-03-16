const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  urlRoot: String,
  url: String,
  data: String,
  responseTime: Number,
  responseStatus: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", ContentSchema);

module.exports = Content;
