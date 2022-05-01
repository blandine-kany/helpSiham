//Database Configuration
const mongoose = require("mongoose");
const logger = require("../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    logger.info({ message: "Connected to database successfully :)", filePath });
  })
  .catch((error) => {
    logger.error({
      message: "Failed to establish connection to the database!",
      filePath,
      error,
    });
  });

module.exports = mongoose;
