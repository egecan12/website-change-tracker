const contentController = require("../controllers/contentController");
const recordController = require("../controllers/recordController");
const targetLinkController = require("../controllers/targetLinkController");

exports.runOperation = async (req, res, next) => {
  try {
    // Gets websites' url links from TargetLinks collection
    const targetLinks = await targetLinkController.fetchTargetLinks();

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
    const comparedLinks = await contentController.compareContent(
      targetLinks,
      (error) => {
        if (error) {
          console.error(error);
          // Handle the error as needed
        }
      }
    );
    //Writes comparison records  to a Google Spreadsheet
    const resultedLinks = await recordController.showRecords(comparedLinks);

    res
      .status(200)
      .send("these links have been processed successfully :" + resultedLinks);

    // Continue with your logic using targetLinks...
  } catch (error) {
    next(error);
  }
};
