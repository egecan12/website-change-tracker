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
      status: 111,
      responseTime: null,
      responseStatusText: "Not Found",
      errorMessage: error.message,
    };
  }
};

exports.compareContent = async (urls) => {
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
    // Send email and SMS notifications if the content has changed
    if (contentHasChanged) {
      await sendContentChangedEmail(
        process.env.EMAIL_RECEIVER_ADDRESS,
        fixedUrl
      );
      // await sendContentChangedSms(
      //   "+905343195969",
      //   "The content you are tracking has changed."
      // );
    }

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
};
exports.findRecords = async (urls) => {
  try {
    // Check if urls is an array
    if (!Array.isArray(urls)) {
      throw new Error("Invalid input - urls should be an array");
    }

    let records = []; // Array to store the records of each URL

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];

      let fixedInputUrl = removeProtocolAndWWW(url);

      // Fetch the records for the URL
      const urlRecords = await Record.find({ url: fixedInputUrl });

      // If urlRecords is empty, skip to the next item
      if (urlRecords.length === 0) {
        continue;
      }

      // Add the records to the array
      records.push({
        url: url,
        records: urlRecords,
      });
    }

    // Return the array of records
    return records;
  } catch (error) {
    console.error("Error : fetching records from database:", error);
    throw error;
  }
};
exports.showRecords = async (urls) => {
  // Convert array of urls to array of objects with url property

  const records = await exports.findRecords(urls);

  // Loop over each record and call writeToGoogleSheets

  await writeToGoogleSheets(records);

  return urls;
};
