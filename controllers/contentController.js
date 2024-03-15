const express = require("express");
const axios = require("axios");

let siteUrl = "https://kahyaogluegecan.tech";

exports.fetchWebsiteContent = async (req, res) => {
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
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching website content:", error);
    res.status(500).send("Error fetching website content");
  }
};
