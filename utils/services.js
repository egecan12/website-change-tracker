const axios = require("axios");
const Content = require("../models/contentModel");
const Record = require("../models/recordModel");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
} = require("../utils/urlModifier");
const {
  sendContentChangedEmail,
} = require("../utils/emailSender/emailTemplates");
const { sendSms } = require("../utils/smsSender/smsSender");
const { writeToGoogleSheets } = require("../utils/googleSheetsService");
const { simplifyHTML } = require("../utils/htmlSimplifier");

// This function fetches content from a URL, calculates the response time, and returns an object with the response details.

exports.fetchCurrentContent = async (inputUrl) => {
  try {
    const modifiedUrl = addProtocolAndWWW(inputUrl);

    // Record the start time
    const startTime = Date.now();
    const response = await axios.get(modifiedUrl, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
      },
    });
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
      status: 0,
      responseTime: 0,
      responseStatusText: "This url does not return any response",
      errorMessage: error.message,
    };
  }
};
// This function compares the current content of each URL in the input array with its cached content.
// If the content has changed, it sends an email notification and updates the record in the database.
// If the content is not cached, it saves the current content as cached content.
// It returns an array of processed URLs.

exports.compareContent = async (urls) => {
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

      // Send email and SMS notifications if the content has changed and if the record exists
      const comparisonRecord = await Record.find({ url: fixedUrl });

      //if the URL has 1 record to compare with current record which comes from live website
      if (comparisonRecord.length > 0) {
        //if there is any change send notifications
        if (contentHasChanged) {
          const emailSent = await sendContentChangedEmail(
            process.env.EMAIL_RECEIVER_ADDRESS,
            fixedUrl
          );
          //You should comment-in that part If you want to send sms notification

          // await sendContentChangedSms(
          //   "SMS_RECEIVER_NUMBER",
          //   "The content you are tracking has changed."
          // );
          if (emailSent) {
            console.log(
              `Email sent to ${process.env.EMAIL_RECEIVER_ADDRESS} for URL: ${fixedUrl}`
            );
          } else {
            console.log(`Failed to send email for URL: ${fixedUrl}`);
          }
        }
      }

      // Create a record object and save it to the Records collection
      const record = new Record({
        url: fixedUrl,
        contentHasChanged: contentHasChanged,
        previousResponseStatus: cachedContent.responseStatus,
        recentResponseStatus: currentContent.status,
        previousResponseTime: cachedContent.responseTime,
        recentResponseTime: currentContent.responseTime,
        previousResponseStatusText: cachedContent.responseStatusText,
        recentResponseStatusText: currentContent.responseStatusText,
      });
      await record.save();
      // Updates the Content collection with currentContent where url equals fixedUrl
      const updatedContent = await Content.findOneAndUpdate(
        { url: fixedUrl },
        {
          $set: {
            data: currentContent.data,
            responseTime: currentContent.responseTime,
            responseStatus: currentContent.status,
            responseStatusText: currentContent.responseStatusText,
          },
        },
        { new: true, upsert: true }
      );
      console.log(updatedContent);
    }

    // Returns the input array
    return processedUrls;
  } catch (error) {
    console.error(`Error in compareContent: ${error}`);
    throw error;
  }
};

// This function fetches and returns the records for each URL in the input array.
// If the input is not an array or if there are no records for a URL, it skips to the next URL.
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
//This function will show all records in a Google Spreadsheet
exports.showRecords = async (urls) => {
  try {
    const records = await exports.findRecords(urls);
    await writeToGoogleSheets(records);
    return urls;
  } catch (error) {
    console.error(`Error in showRecords: ${error}`);
    throw error; // re-throw the error so it can be handled by the caller
  }
};
