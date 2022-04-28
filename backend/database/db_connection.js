//Database Configuration
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database successfully :)");
  })
  .catch((error) => {
    console.error("Failed to establish connection to the database!");
    throw error;
  });

module.exports = mongoose;
