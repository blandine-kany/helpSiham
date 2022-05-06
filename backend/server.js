/*************************
 * Server configuration
 * ***********************
 */

// Import dependencies
require("dotenv").config({ path: __dirname + "/config/.env" });
require("./database/db_connection");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const logger = require("./config/logger");
const path = require("path");

// Variables
const app = express();
const port = process.env.SERVER_PORT || 5000;
const filePath = path.relative(__dirname + "/..", __filename);

// Import the routes
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const studentRoute = require("./routes/studentRoute");
const courseRoute = require("./routes/courseRoute");

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

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/students", studentRoute);
app.use("/api/v1/courses", courseRoute);

// Listening on port
app.listen(port, (error) => {
  if (error) {
    logger.error({
      message: "Failed to start the server! 😭😭",
      filePath,
      error,
    });
  } else {
    logger.info({
      message: `Server is running on port ${port} 😎😎`,
      filePath,
    });
  }
});
