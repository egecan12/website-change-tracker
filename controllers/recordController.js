const axios = require("axios");
const Record = require("../models/recordModel");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
  validURL,
} = require("../utils/urlModifier");
exports.fetchRecordsByLink = async (req, res) => {
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
exports.fetchRecords = async (req, res) => {
  try {
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    let records = []; // Array to store the records of each URL

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];

      // Remove the protocol and 'www' from the URL
      let fixedUrl = removeProtocolAndWWW(url);

      // Fetch the records for the URL
      const urlRecords = await Record.find({ url: fixedUrl });

      // If urlRecords is empty, skip to the next item
      if (urlRecords.length === 0) {
        continue;
      }

      // Add the records to the array
      records.push({
        url: url,
        records: urlRecords,
      });
    }

    // Send the array of records as the response
    res.send(records);
  } catch (error) {
    console.error("Error : fetching records from database:", error);
    res.status(500).send("Error : fetching records from database");
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
