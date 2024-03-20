const TargetLink = require("../models/targetLinkModel");
const { removeProtocolAndWWW, validURL } = require("../utils/urlModifier");

//FUNCTIONS

//Saves website links to DB

exports.saveTargetLink = async (req, res, next) => {
  try {
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    let savedCount = 0;
    for (let url of urls) {
      // Check if url is a valid URL
      if (!validURL(url)) {
        console.warn("Invalid URL:", url);
        continue;
      }

      // Fixes the urls before they are sent out to DB
      const fixedInputUrl = removeProtocolAndWWW(url);

      // Check if a record with the same url already exists
      const existingTargetLink = await TargetLink.findOne({
        url: fixedInputUrl,
      });
      if (existingTargetLink) {
        console.warn("URL already exists:", url);
        continue;
      }

      // If no existing record, save the new target link
      const newTargetLink = new TargetLink({
        url: fixedInputUrl,
      });

      await newTargetLink.save();
      savedCount++;
    }

    res.status(200).send(`${savedCount} target links saved successfully`);
  } catch (error) {
    console.error("Error saving target links to database:", error);
    res
      .status(500)
      .send(`Error saving target links to database: ${error.message}`);
    next(error);
  }
};

//Deletes website links from DB

exports.deleteTargetLink = async (req, res) => {
  try {
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    let deletedCount = 0;
    for (let url of urls) {
      // Check if url is a valid URL
      if (!validURL(url)) {
        console.warn("Invalid URL:", url);
        continue;
      }

      // Fixes the urls before they are sent out to DB
      const fixedInputUrl = removeProtocolAndWWW(url);

      // Delete the target link
      const targetLink = await TargetLink.findOneAndDelete({
        url: fixedInputUrl,
      });
      if (!targetLink) {
        console.warn("No target link found with this url:", url);
        continue;
      }

      deletedCount++;
    }

    res.status(200).send(`${deletedCount} target links deleted successfully`);
  } catch (error) {
    console.error("Error deleting target links from database:", error);
    res
      .status(500)
      .send(`Error deleting target links from database: ${error.message}`);
  }
};
