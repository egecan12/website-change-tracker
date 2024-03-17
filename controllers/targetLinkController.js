const axios = require("axios");
const TargetLink = require("../models/targetLinkModel");
const { URL } = require("url");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
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
    //fixes the urls before they are sent out to DB
    const fixedInputUrl = removeProtocolAndWWW(req.body.url);
    const modifiedInputUrl = addProtocolAndWWW(req.body.url);

    const url = new URL(modifiedInputUrl);
    const urlRoot = removeProtocolAndWWW(url.origin);

    // Check if a record with the same url already exists
    const existingTargetLink = await TargetLink.findOne({ url: fixedInputUrl });
    if (existingTargetLink) {
      return res
        .status(400)
        .send("Invalid operation - This link is already added to targets list");
    }

    // If no existing record, save the new target link
    const newTargetLink = new TargetLink({
      url: fixedInputUrl,
      urlRoot: urlRoot,
    });
    await newTargetLink.save();

    res.status(201).send(newTargetLink);
  } catch (error) {
    console.error("Error saving target link to database:", error);
    res.status(500).send("Error saving target link to database");
  }
};

exports.deleteTargetLink = async (req, res) => {
  try {
    const { url } = req.body;

    const fixedInputUrl = removeProtocolAndWWW(url);

    // finds the target link by url and delete it
    const targetLink = await TargetLink.findOneAndDelete({
      url: fixedInputUrl,
    });

    if (!targetLink) {
      return res.status(404).send("No target link found with this url");
    }

    res.status(200).send("Target link deleted successfully");
  } catch (error) {
    console.error("Error deleting target link from database:", error);
    res.status(500).send("Error deleting target link from database");
  }
};
