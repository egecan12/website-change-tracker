const axios = require("axios");
const TargetLink = require("../models/targetLinkModel");
const { URL } = require("url");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
  validURL,
} = require("../utils/urlModifier");

//FUNCTIONS
exports.fetchTargetLinks = async (req, res) => {
  try {
    const targetLinks = await TargetLink.find({});
    res.status(200).send(targetLinks);
  } catch (error) {
    res.status(500).send("Error fetching target links from database");
    console.error("Error fetching target links from database:", error);
    throw error;
  }
};

exports.saveTargetLink = async (req, res) => {
  try {
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    for (let url of urls) {
      // Check if url is a valid URL
      if (!validURL(url)) {
        continue;
      }

      // Fixes the urls before they are sent out to DB
      const fixedInputUrl = removeProtocolAndWWW(url);
      console.log("fixedInputUrl:" + fixedInputUrl);

      const modifiedUrl = addProtocolAndWWW(url);
      const urlObj = new URL(modifiedUrl);

      const urlRoot = urlObj.origin;
      const fixedurlRoot = removeProtocolAndWWW(url);

      // Check if a record with the same url already exists
      const existingTargetLink = await TargetLink.findOne({
        url: fixedInputUrl,
      });
      if (existingTargetLink) {
        //if the link already added, skip to the next one
        continue;
      }

      // If no existing record, save the new target link
      const newTargetLink = new TargetLink({
        url: fixedInputUrl,
        urlRoot: fixedurlRoot,
      });

      await newTargetLink.save();
    }

    res.status(200).send("Target links saved successfully");
  } catch (error) {
    console.error("Error saving target links to database:", error);
    res.status(500).send("Error saving target links to database");
  }
};

exports.deleteTargetLink = async (req, res) => {
  try {
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    for (let url of urls) {
      // Check if url is a valid URL
      if (!validURL(url)) {
        console.log("invalid url");
        continue;
      }

      // Fixes the urls before they are sent out to DB
      const fixedInputUrl = removeProtocolAndWWW(url);

      // Delete the target link
      const targetLink = await TargetLink.findOneAndDelete({
        url: fixedInputUrl,
      });
      if (!targetLink) {
        console.log("No target link found with this url");
        continue;
      }
    }

    res.status(200).send("Target links deleted successfully");
  } catch (error) {
    console.error("Error deleting target links from database:", error);
    res.status(500).send("Error deleting target links from database");
  }
};
