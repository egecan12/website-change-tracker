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
      status: 404,
      responseTime: null,
      responseStatusText: "Not Found",
      errorMessage: error.message,
    };
  }
};

exports.compareContent = async (urls, next) => {
  try {
    // Create an empty array to store the URLs
    let processedUrls = [];

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i].url;
      processedUrls.push(url);

      // Remove the protocol and 'www' from the URL
      let fixedUrl = removeProtocolAndWWW(url);

      // Add the protocol and 'www' back to the URL
      let modifiedUrl = addProtocolAndWWW(fixedUrl);

      // Fetch the current content
      let currentContent = await exports.fetchCurrentContent(modifiedUrl);

      // Check if content is cached
      const cachedContent = await Content.findOne({ url: fixedUrl });

      if (!cachedContent) {
        // If content is not cached, save the current content as cached content
        const newContent = new Content({
          url: fixedUrl,
          data: currentContent.data,
          responseTime: currentContent.responseTime,
          responseStatus: currentContent.status,
          responseStatusText: currentContent.statusText,
        });
        await newContent.save();
        continue;
      }

      const simplifiedCurrentContent = simplifyHTML(currentContent.data ?? "");
      const simplifiedCachedContent = simplifyHTML(cachedContent.data ?? "");

      // Compare the current and cached content
      const contentHasChanged =
        simplifiedCurrentContent !== simplifiedCachedContent;

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
      //Here there should be message and email notification sender method

      // Updates the Content collection with currentContent where url equals fixedUrl
      await Content.findOneAndUpdate(
        { url: fixedUrl },
        {
          $set: {
            data: currentContent.data,
            responseTime: currentContent.responseTime,
            responseStatus: currentContent.status,
            responseStatusText: currentContent.statusText,
          },
        },
        { new: true, upsert: true }
      );
    }

    // Returns the input array
    return processedUrls;
  } catch (error) {
    next(error);
  }
};
