const express = require("express");
const axios = require("axios");
const Content = require("../models/contentModel");
const { URL } = require("url");

let siteUrl = "https://kahyaogluegecan.tech/sample-page/";

exports.fetchUrlCurrentContent = async (req, res) => {
  try {
    const inputUrl = req.params.inputUrl || siteUrl;
    const response = await axios.get(inputUrl);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching website content:", error);
    res.status(500).send("Error fetching website content");
  }
};

exports.fetchUrlCachedContent = async (req, res) => {
  try {
    const inputUrl = req.query.inputUrl;
    // Remove "https://" and "www." from inputUrl and urlRoot
    fixedInputUrl = inputUrl.replace(/(https?:\/\/)?(www\.)?/, "");

    console.log(fixedInputUrl);

    const content = await Content.findOne({ url: fixedInputUrl });

    if (!content) {
      return res.status(404).send("No content found for the provided URL");
    }

    res.send(content);
  } catch (error) {
    console.error("Error fetching content from database:", error);
    res.status(500).send("Error fetching content from database");
  }
};
exports.addUrlContent = async (req, res) => {
  try {
    const inputUrl = req.params.inputUrl || siteUrl;
    const response = await axios.get(inputUrl);

    const url = new URL(inputUrl);
    const urlRoot = url.origin;

    // Remove "https://" and "www." from inputUrl and urlRoot
    fixedInputUrl = inputUrl.replace(/(https?:\/\/)?(www\.)?/, "");
    fixedUrlRoot = urlRoot.replace(/(https?:\/\/)?(www\.)?/, "");
    // If inputUrl ends with a "/", remove it
    if (fixedInputUrl.endsWith("/")) {
      fixedInputUrl = fixedInputUrl.slice(0, -1);
    }
    // If urlRoot ends with a "/", remove it
    if (fixedUrlRoot.endsWith("/")) {
      fixedUrlRoot = fixedUrlRoot.slice(0, -1);
    }

    const content = new Content({
      url: fixedInputUrl,
      urlRoot: fixedUrlRoot,
      data: response.data,
    });
    await content.save();

    res.send("Content saved successfully");
  } catch (error) {
    console.error("Error fetching website content:", error);
    res.status(500).send("Error fetching website content");
  }
};
