const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  urlRoot: String,
  data: String,
  responseTime: Number,
  responseStatus: Number,
  responseStatusText: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", ContentSchema);

module.exports = Content;
