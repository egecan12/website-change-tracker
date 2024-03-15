const express = require("express");
const axios = require("axios");
const Content = require("../models/contentModel");
const { URL } = require("url");

let siteUrl = "https://kahyaogluegecan.tech/sample-page/";

exports.fetchUrlContent = async (req, res) => {
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
exports.addUrlContent = async (req, res) => {
  try {
    const inputUrl = req.params.inputUrl || siteUrl;
    const response = await axios.get(inputUrl);

    const url = new URL(inputUrl);
    const urlRoot = url.origin;

    const content = new Content({
      url: inputUrl,
      urlRoot: urlRoot,
      data: response.data,
    });
    await content.save();

    res.send("Content saved successfully");
  } catch (error) {
    console.error("Error fetching website content:", error);
    res.status(500).send("Error fetching website content");
  }
};
