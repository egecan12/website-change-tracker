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

exports.checkIfContentCached = async (req, res) => {
  try {
    const inputUrl = req.query.inputUrl;

    //we will need fixedUrl to seacrh it in DB
    const fixedUrl = removeProtocolAndWWW(inputUrl);

    //just brings the most recent content
    const content = await Content.findOne({ url: fixedUrl })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!content) {
      console.log("No content found for the provided URL. Saving content...");
      await saveContent(inputUrl);
      //checkIfContentCached is called again to get the newly saved content.
      res.send("The content has been successfully cached.");
    }
    res.send("The content had already cached");
  } catch (error) {
    console.error("Error fetching content from database:", error);
    throw error;
  }
};
exports.saveContent = async (req, res) => {
  try {
    const inputUrl = req.query.inputUrl;

    //make sure the request url contains http, https or www.
    const fixedUrl = addProtocolAndWWW(inputUrl);

    //calculatesthe response time
    const startTime = Date.now();
    const response = await axios.get(fixedUrl);
    const responseTime = Date.now() - startTime;
    console.log(`Response time for ${inputUrl}: ${responseTime} ms`);

    //fixes the urls before they are sent out to DB
    const url = new URL(fixedUrl);
    const urlRoot = url.origin;
    const fixedInputUrl = removeProtocolAndWWW(inputUrl);
    const fixedUrlRoot = removeProtocolAndWWW(urlRoot);

    const content = new Content({
      url: fixedInputUrl,
      urlRoot: fixedUrlRoot,
      data: response.data,
      responseTime: responseTime,
      responseStatus: response.status,
    });
    await content.save();
    res.status(201).send("Content saved successfully");
  } catch (error) {
    console.error("Error saving content to DB:", error);
    res.status(500).send("Error saving content to DB");
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
      currentContent = data.currentContent;
      currentStatus = data.status;
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
      cachedContent = cachedContentObject.data;
      cachedStatus = cachedContentObject.responseStatus;
    } catch (error) {
      if (error.message === "No content found for the provided URL") {
        return res.status(404).send("This web link is not cached");
      }
      throw error;
    }

    //Compares if the content is the same
    const isContentSame = currentContent === cachedContent;

    //Compares if the status is the same
    const isStatusSame = currentStatus === cachedStatus;
    if (!isContentSame) {
      await sendContentChangedEmail("kahyaogluegecan@gmail.com");
    }
    // await sendContentChangedSms(
    //   "+905343195969",
    //   "The content you are tracking has changed."
    // );

    res.status(200).send({ isContentSame, isStatusSame });
  } catch (error) {
    console.error("Error comparing content:", error);
    res.status(500).send("Error comparing content");
  }
};
