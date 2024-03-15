const express = require("express");
const axios = require("axios");
const Content = require("../models/contentModel");
const { URL } = require("url");
const {
  removeProtocolAndWWW,
  addProtocolAndWWW,
} = require("../utils/urlModifier");
let siteUrl = "https://kahyaogluegecan.tech/sample-page/";

// exports.fetchUrlCurrentContent = async (req, res) => {
//   try {
//     const inputUrl = req.params.inputUrl || siteUrl;
//     const response = await axios.get(inputUrl);
//     console.log(response.data);
//     res.send(response.data);
//   } catch (error) {
//     console.error("Error fetching website content:", error);
//     res.status(500).send("Error fetching website content");
//   }
// };

// exports.fetchUrlCachedContent = async (req, res) => {
//   try {
//     const inputUrl = req.query.inputUrl;
//     // Remove "https://" and "www." from inputUrl and urlRoot
//     fixedInputUrl = removeProtocolAndWWW(inputUrl);

//     console.log(fixedInputUrl);

//     const content = await Content.findOne({ url: fixedInputUrl });

//     if (!content) {
//       return res.status(404).send("No content found for the provided URL");
//     }

//     res.send(content);
//   } catch (error) {
//     console.error("Error fetching content from database:", error);
//     res.status(500).send("Error fetching content from database");
//   }
// };

exports.fetchUrlCurrentContent = async (inputUrl) => {
  try {
    const fixedUrl = addProtocolAndWWW(inputUrl);
    const response = await axios.get(fixedUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw error;
  }
};

exports.fetchUrlCachedContent = async (inputUrl) => {
  try {
    const fixedUrl = removeProtocolAndWWW(inputUrl);

    const content = await Content.findOne({ url: fixedUrl });

    if (!content) {
      throw new Error("No content found for the provided URL");
    }
    return content;
  } catch (error) {
    console.error("Error fetching content from database:", error);
    throw error;
  }
};
exports.saveUrlContent = async (req, res) => {
  try {
    const inputUrl = req.params.inputUrl || siteUrl;

    const startTime = Date.now();
    const response = await axios.get(inputUrl);
    const responseTime = Date.now() - startTime;
    console.log(`Response time for ${inputUrl}: ${responseTime} ms`);

    const url = new URL(inputUrl);
    const urlRoot = url.origin;

    let fixedInputUrl = removeProtocolAndWWW(inputUrl);
    let fixedUrlRoot = removeProtocolAndWWW(urlRoot);

    const content = new Content({
      url: fixedInputUrl,
      urlRoot: fixedUrlRoot,
      data: response.data,
      responseTime: responseTime,
    });
    await content.save();

    res.send("Content saved successfully");
  } catch (error) {
    console.error("Error fetching website content:", error);
    res.status(500).send("Error fetching website content");
  }
};
exports.compareContent = async (req, res) => {
  try {
    const inputUrl = req.query.inputUrl;

    const currentContent = await exports.fetchUrlCurrentContent(inputUrl);
    //console.log("Current content:", currentContent);

    const cachedContent = await exports.fetchUrlCachedContent(inputUrl);
    // console.log("Cached content:", cachedContent.data);

    //Compare if the data is the same
    const isSame =
      JSON.stringify(currentContent) === JSON.stringify(cachedContent.data);

    res.send({ isSame });
  } catch (error) {
    console.error("Error comparing content:", error);
    res.status(500).send("Error comparing content");
  }
};
