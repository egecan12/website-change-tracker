const contentController = require("../controllers/contentController");
const recordController = require("../controllers/recordController");
const targetLinkController = require("../controllers/targetLinkController");

exports.runOperation = async (req, res, next) => {
  try {
    // Call fetchTargetLinks and assign its result to a variable
    const targetLinks = await targetLinkController.fetchTargetLinks();

    // Check if targetLinks is an array
    if (!Array.isArray(targetLinks)) {
      return res
        .status(400)
        .send("Invalid output - targetLinks should be an array");
    }
    const comparedLinks = await contentController.compareContent(
      targetLinks,
      (error) => {
        if (error) {
          console.error(error);
          // Handle the error as needed
        }
      }
    );

    const resultedLinks = await recordController.showRecords(comparedLinks);

    res
      .status(200)
      .send("these links have been processed successfully :" + resultedLinks);

    // Continue with your logic using targetLinks...
  } catch (error) {
    next(error);
  }
};
