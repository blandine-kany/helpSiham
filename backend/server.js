require("dotenv").config();

// Import dependencies
const express = require("express");
const app = express();
const cors = require("cors");

// variables
const port = process.env.SERVER_PORT || 5000;

//import the routes
const userRoute = require("./routes/userRoute");
const studentRoute = require("./routes/studentRoute");

// CORS Middleware
var corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  //add other
};
app.use(cors(corsOptions));

// parses application/json content and creates JS-accessible variables under (req.body)
app.use(express.json());

//Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/students", studentRoute);

//Listening on port
const listener = app.listen(port, (error) => {
  if (error) {
    throw error;
  } else {
    console.log("Server is running on port " + listener.address().port);
  }
});
