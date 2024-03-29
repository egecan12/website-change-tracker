const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    lowercase: true,
  },
  contentHasChanged: {
    type: Boolean,
  },
  previousResponseStatus: {
    type: Number,
  },
  recentResponseStatus: {
    type: Number,
  },
  previousResponseTime: {
    type: Number,
  },
  recentResponseTime: {
    type: Number,
  },
  previousResponseStatusText: {
    type: String,
    default: "N/A",
  },
  recentResponseStatusText: {
    type: String,
    default: "N/A",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model("Record", RecordSchema);

module.exports = Record;
