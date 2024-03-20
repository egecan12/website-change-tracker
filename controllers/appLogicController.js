const services = require("../utils/services");
const TargetLink = require("../models/targetLinkModel");

// This function fetches URLs, compares content, writes records to a spreadsheet, and logs results or errors.

exports.start = async () => {
  try {
    // Gets websites' url links from TargetLinks collection
    const targetLinks = await TargetLink.find({});

    // Makes sure targetLinks are in an array
    if (!Array.isArray(targetLinks)) {
      console.error("Invalid output - targetLinks should be an array");
      return;
    }

    //Compares current content vs cached content

    const comparedLinks = await services.compareContent(
      targetLinks,
      (error) => {
        if (error) {
          console.error(error);
          // Handle the error as needed
        }
      }
    );
    //Writes comparison records  to a Google Spreadsheet

    const resultedLinks = await services.showRecords(comparedLinks);

    const jsonResult = {
      urls: resultedLinks,
    };

    console.log(jsonResult);
  } catch (error) {
    console.error(error);
  }
};
// We need that function to be able to start our app with the end-point
exports.runOperation = async (req, res, next) => {
  try {
    await exports.start();
    res.status(200).json({ message: "Operation started" });
  } catch (error) {
    next(error);
  }
};
