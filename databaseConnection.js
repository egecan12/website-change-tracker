const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.DB_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error", error);
  }
}

module.exports = connectToDatabase;
