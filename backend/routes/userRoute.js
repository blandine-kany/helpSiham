const express = require("express");
const router = express.Router();

// Require controller module
const userController = require("../controllers/userController");

/* API REST v1/users - Routes */


router.use((req, res, next) => {
  console.log("user - Time: ", Date.now());
  next();
});

// GET request to display all the users
router.get("/", userController.getAllUsers); //status verification

// POST request to login

// POST request to register

// GET request to logout

// GET request to access user's profile

// PUT request to update user's profile

// DELETE request to delete a user account


// export to use in server.js
module.exports = router;
