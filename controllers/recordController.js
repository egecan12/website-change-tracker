const Record = require("../models/recordModel");
const { removeProtocolAndWWW, validURL } = require("../utils/urlModifier");
const { writeToGoogleSheets } = require("../utils/googleSheetsService");

//FUNCTIONS
exports.findRecords = async (urls) => {
  try {
    // Check if urls is an array
    if (!Array.isArray(urls)) {
      throw new Error("Invalid input - urls should be an array");
    }

    let records = []; // Array to store the records of each URL

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];

      let fixedInputUrl = removeProtocolAndWWW(url);

      // Fetch the records for the URL
      const urlRecords = await Record.find({ url: fixedInputUrl });

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

    // Return the array of records
    return records;
  } catch (error) {
    console.error("Error : fetching records from database:", error);
    throw error;
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
    next(error);
  }
};
exports.showRecords = async (urls, next) => {
  try {
    // Convert array of urls to array of objects with url property
    // urls.map((url) => ({ url }));
    const records = await exports.findRecords(urls);

    // Loop over each record and call writeToGoogleSheets

    await writeToGoogleSheets(records);

    return urls;
  } catch (error) {
    console.error("Error writing records to Google Sheets:", error);
    next(error);
  }
};
