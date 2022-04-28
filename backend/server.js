/*************************
 * Server configuration
 * ***********************
 */

// Import dependencies
require("dotenv").config();
require("./database/db_connection");
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

// Variables
const port = process.env.SERVER_PORT || 5000;

// Import the routes
const userRoute = require("./routes/userRoute");
const studentRoute = require("./routes/studentRoute");

// CORS Middleware
let corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
  headers: ["Content-Type", "X-Requested-With", "Authorization"],
};
app.use(cors(corsOptions));

// Session configuration
let sess = {
  secret: process.env.SECRET_KEY,
  name: "uniqueSessionID",
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  httpOnly: true,
  resave: true,
  saveUninitialized: true,
};

app.use(session(sess));

// parses application/json content and creates JS-accessible variables under (req.body)
app.use(express.json());

// parses requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Routes
app.use("/api/users/v1/", userRoute);
app.use("/api/students/v1/", studentRoute);

// Listening on port
app.listen(port, (error) => {
  if (error) {
    console.error(error);
    throw error;
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
