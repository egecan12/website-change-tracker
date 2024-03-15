const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  urlRoot: String,
  url: String,
  data: String,
});

const Content = mongoose.model("Content", ContentSchema);

module.exports = Content;
