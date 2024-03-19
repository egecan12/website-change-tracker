const services = require("../utils/services");
const TargetLink = require("../models/targetLinkModel");

exports.runOperation = async (req, res, next) => {
  try {
    // Gets websites' url links from TargetLinks collection
    const targetLinks = await TargetLink.find({});

    // Makes sure targetLinks are in an array
    if (!Array.isArray(targetLinks)) {
      return res
        .status(400)
        .send("Invalid output - targetLinks should be an array");
    }

    //1)Checks if the url has alrady cached -> if not it will save the content to Contents collection
    //2)Gets current content from live and Gets cached content from DB
    //3)Compares currentcontent vs cached content
    //4)Sends notifications if contentHasChanged == true
    //5)Updates the cached content with the most recent content.
    //6)Saves comparison record to Records collection
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

    res
      .status(200)
      .send("these links have been processed successfully :" + resultedLinks);

    // Continue with your logic using targetLinks...
  } catch (error) {
    next(error);
  }
};
