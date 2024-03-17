const axios = require("axios");
const Content = require("../models/contentModel");
const { URL } = require("url");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
} = require("../utils/urlModifier");
const { sendEmail } = require("../utils/emailSender/emailSender");
const {
  sendContentChangedEmail,
} = require("../utils/emailSender/emailTemplates");
const { sendSms } = require("../utils/smsSender/smsSender");
const { saveRecord } = require("./recordController");

//FUNCTIONS

exports.fetchCurrentContent = async (inputUrl) => {
  try {
    const fixedUrl = addProtocolAndWWW(inputUrl);
    const response = await axios.get(fixedUrl);
    return {
      currentContent: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw error;
  }
};

exports.fetchCachedContent = async (inputUrl) => {
  try {
    const fixedUrl = removeProtocolAndWWW(inputUrl);

    //just brings the most recent content
    const content = await Content.findOne({ url: fixedUrl })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!content) {
      throw new Error("No content found for the provided URL");
    }
    return content;
  } catch (error) {
    console.error("Error fetching content from database:", error);
    throw error;
  }
};
// exports.saveContent = async (req, res) => {
//   try {
//     const inputUrl = req.query.inputUrl;

//     //make sure the request url contains http, https or www.
//     const fixedUrl = addProtocolAndWWW(inputUrl);

//     //calculatesthe response time
//     const startTime = Date.now();
//     const response = await axios.get(fixedUrl);
//     const responseTime = Date.now() - startTime;
//     console.log(`Response time for ${inputUrl}: ${responseTime} ms`);

//     //fixes the urls before they are sent out to DB
//     const url = new URL(fixedUrl);
//     const urlRoot = url.origin;
//     const fixedInputUrl = removeProtocolAndWWW(inputUrl);
//     const fixedUrlRoot = removeProtocolAndWWW(urlRoot);

//     const content = new Content({
//       url: fixedInputUrl,
//       urlRoot: fixedUrlRoot,
//       data: response.data,
//       responseTime: responseTime,
//       responseStatus: response.status,
//     });
//     await content.save();
//   } catch (error) {
//     console.error("Error saving content to DB:");
//     throw error;
//   }
// };
// exports.checkIfContentCached = async (req, res) => {
//   try {
//     const inputUrl = req.query.inputUrl;
//     const fixedUrl = removeProtocolAndWWW(inputUrl);
//     const modifedUrl = addProtocolAndWWW(inputUrl);

//     console.log(modifedUrl);

//     const content = await Content.findOne({ url: fixedUrl })
//       .sort({ createdAt: -1 })
//       .limit(1);

//     if (!content) {
//       console.log("No content found for the provided URL. Saving content...");
//       try {
//         const startTime = Date.now();
//         const response = await axios.get(modifedUrl);
//         const responseTime = Date.now() - startTime;
//         console.log(`Response time for ${inputUrl}: ${responseTime} ms`);

//         const url = new URL(modifedUrl);
//         const urlRoot = url.origin;

//         const newContent = new Content({
//           url: fixedUrl,
//           urlRoot: urlRoot,
//           data: response.data,
//           responseTime: responseTime,
//           responseStatus: response.status,
//         });
//         await newContent.save();

//         res.send("The content has been successfully cached.");
//       } catch (error) {
//         console.error("Error saving content to DB:", error);
//         res.status(500).send("Error saving content to DB");
//       }
//     } else {
//       res.send("The content had already been cached");
//     }
//   } catch (error) {
//     console.error("Error : writing content to database:", error);
//     res.status(500).send("Error : writing content to database");
//   }
// };
exports.checkIfContentCached = async (req, res) => {
  try {
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    let urlStatuses = []; // Array to store the status of each URL

    for (let i = 0; i < urls.length; i++) {
      const inputUrl = urls[i];
      const fixedUrl = removeProtocolAndWWW(inputUrl);
      const modifedUrl = addProtocolAndWWW(inputUrl);

      console.log(modifedUrl);

      const content = await Content.findOne({ url: fixedUrl })
        .sort({ createdAt: -1 })
        .limit(1);

      if (!content) {
        console.log("No content found for the provided URL. Saving content...");
        try {
          const startTime = Date.now();
          const response = await axios.get(modifedUrl);
          const responseTime = Date.now() - startTime;
          console.log(`Response time for ${inputUrl}: ${responseTime} ms`);

          const url = new URL(modifedUrl);
          const urlRoot = url.origin;

          const newContent = new Content({
            url: fixedUrl,
            urlRoot: urlRoot,
            data: response.data,
            responseTime: responseTime,
            responseStatus: response.status,
          });
          await newContent.save();

          // Add the status of the URL to the array
          urlStatuses.push({
            url: inputUrl,
            status: "The content has been successfully cached.",
          });
        } catch (error) {
          console.error("Error saving content to DB:", error);
          // Add the status of the URL to the array
          urlStatuses.push({
            url: inputUrl,
            status: "Error saving content to DB",
          });
        }
      } else {
        // Add the status of the URL to the array
        urlStatuses.push({
          url: inputUrl,
          status: "The content had already been cached",
        });
      }
    }

    // Send the array of URL statuses as the response
    res.send(urlStatuses);
  } catch (error) {
    console.error("Error : writing content to database:", error);
    res.status(500).send("Error : writing content to database");
  }
};
exports.compareContent = async (req, res) => {
  try {
    const inputUrl = req.query.inputUrl;

    let currentContent;
    let currentStatus;
    try {
      //gets the current stage
      data = await exports.fetchCurrentContent(inputUrl);
      //sets the current stage to variables
      currentContentObject = data;
      console.log(
        "currentContentObject:" + JSON.stringify(currentContentObject)
      );
      currentContent = currentContentObject.currentContent;
      currentStatus = currentContentObject.Status;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).send("This web link does not exist");
      }
      throw error;
    }

    let cachedContentObject;
    let cachedContent;
    let cachedStatus;
    try {
      //gets the latest cached stage
      cachedContentObject = await exports.fetchCachedContent(inputUrl);
      console.log("cachedContentObject:" + cachedContentObject);
      cachedContent = cachedContentObject.data;
      cachedStatus = cachedContentObject.responseStatus;
    } catch (error) {
      if (error.message === "No content found for the provided URL") {
        console.log("This web link is not cached");
        throw error;
      }
      throw error;
    }

    //Compares if the content is the same
    const isContentSame = currentContent === cachedContent;

    //Compares if the status is the same
    const isStatusSame = currentStatus === cachedStatus;
    // if (!isContentSame) {
    //   await sendContentChangedEmail("kahyaogluegecan@gmail.com");
    // }
    // await sendContentChangedSms(
    //   "+905343195969",
    //   "The content you are tracking has changed."
    // );

    const newRecordData = {
      url: "mavididim.com",
      previousResponseStatus: cachedContentObject.responseStatus,
      recentResponseStatus: currentContent.Status,
      previousResponseTime: 2500,
      recentResponseTime: 5000,
      contentHasChanged: true,
    };

    await saveRecord({ body: newRecordData }, res);
    res.status(200).send({ isContentSame, isStatusSame });
  } catch (error) {
    console.error("Error comparing content:", error);
    throw error;
  }
};
