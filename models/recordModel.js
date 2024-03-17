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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model("Record", RecordSchema);

module.exports = Record;
