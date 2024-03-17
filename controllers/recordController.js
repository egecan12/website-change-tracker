const axios = require("axios");
const Record = require("../models/recordModel");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
  validURL,
} = require("../utils/urlModifier");
exports.getRecordsByLink = async (req, res) => {
  try {
    const url = req.params.url; // gets the URL from the request parameters

    // checks if url is a valid URL
    if (!validURL(url)) {
      return res.status(400).send("Invalid URL");
    }

    // fixes the urls before they are sent out to DB
    const fixedInputUrl = removeProtocolAndWWW(url);

    // fetchs all records with the given URL
    const records = await Record.find({ url: fixedInputUrl });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records from database:", error);
    res.status(500).send("Error fetching records from database");
  }
};

exports.saveRecord = async (req, res) => {
  try {
    const {
      url,
      previousResponseStatus,
      recentResponseStatus,
      previousResponseTime,
      recentResponseTime,
      contentHasChanged,
    } = req.body;

    // Check if url is a valid URL
    if (!validURL(url)) {
      return res.status(400).send("Invalid URL");
    }

    // Fixes the urls before they are sent out to DB
    const fixedInputUrl = removeProtocolAndWWW(url);

    // Create a new record
    const newRecord = new Record({
      url: fixedInputUrl,
      previousResponseStatus,
      recentResponseStatus,
      previousResponseTime,
      recentResponseTime,
      contentHasChanged,
    });

    // Save the new record
    await newRecord.save();

    // Do not send a response here
  } catch (error) {
    console.error("Error saving record to database:", error);
    res.status(500).send("Error saving record to database");
  }
};
