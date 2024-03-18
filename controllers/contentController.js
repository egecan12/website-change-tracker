const axios = require("axios");
const Content = require("../models/contentModel");
const Record = require("../models/recordModel");
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
const { writeToGoogleSheets } = require("../utils/googleSheetsService");
const { simplifyHTML } = require("../utils/htmlSimplifier");

//FUNCTIONS

exports.fetchCurrentContent = async (inputUrl) => {
  try {
    const fixedUrl = addProtocolAndWWW(inputUrl);

    // Record the start time
    const startTime = Date.now();
    const response = await axios.get(fixedUrl);
    // Record the end time
    const endTime = Date.now();

    // Calculate the response time
    const responseTime = endTime - startTime;
    return {
      data: response.data,
      status: response.status,
      responseTime: responseTime,
      responseStatusText: response.statusText,
    };
  } catch (error) {
    console.error("Error fetching website content:", error);
    return {
      data: null,
      status: "error",
      responseTime: null,
      responseStatusText: "Error fetching website content",
      errorMessage: error.message,
    };
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
      console.log("No content found for the provided URL");
    }
    return content;
  } catch (error) {
    console.error("Error fetching content from database:", error);
    throw error;
  }
};

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
            responseStatusText: response.statusText,
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
            status:
              "Error saving content to DB: This link may be restricted to send response or the server's SSL/TLS certificate is missing, expired, or invalid, it can cause this error",
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
    const urls = req.body.urls; // Expect an array of URLs

    // Check if urls is an array
    if (!Array.isArray(urls)) {
      return res.status(400).send("Invalid input - urls should be an array");
    }

    let urlStatuses = []; // Array to store the status of each URL

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];

      // Remove the protocol and 'www' from the URL
      let fixedUrl = removeProtocolAndWWW(url);

      // Add the protocol and 'www' back to the URL
      let modifiedUrl = addProtocolAndWWW(fixedUrl);

      // Fetch the current content and the cached content
      const currentContent = await exports.fetchCurrentContent(modifiedUrl);
      if (currentContent.data === null) {
        continue;
      }

      const cachedContent = await exports.fetchCachedContent(fixedUrl);

      if (cachedContent === null) {
        continue;
      }
      const simplifiedCurrentContent = simplifyHTML(currentContent.data);
      const simplifiedCachedContent = simplifyHTML(cachedContent.data);

      // Compare the current and cached content
      const contentHasChanged =
        simplifiedCurrentContent !== simplifiedCachedContent;
      const isStatusSame =
        currentContent.status === cachedContent.responseStatus;
      const isStatusTextSame =
        currentContent.responseStatusText === cachedContent.responseStatusText; // Add the status of the URL to the array
      urlStatuses.push({
        url: fixedUrl,
        contentHasChanged: contentHasChanged,
        isStatusSame: isStatusSame,
        isStatusTextSame: isStatusTextSame,
      });

      // Create a record object and save it to the Records collection
      const record = new Record({
        url: fixedUrl,
        contentHasChanged: contentHasChanged,
        previousResponseStatus: cachedContent.responseStatus,
        recentResponseStatus: currentContent.status,
        previousResponseTime: cachedContent.responseTime,
        recentResponseTime: currentContent.responseTime,
      });
      await record.save();
      // Write the new record to Google Sheets
      await writeToGoogleSheets(record);
    }

    // Send the array of URL statuses as the response
    res.send(urlStatuses);
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).send("Error :", error);
  }
};
