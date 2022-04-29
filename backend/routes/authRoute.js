const express = require("express");
const router = express.Router();

// Import functions
const { loginRequired } = require("../utils/helperFunctions");
const {
  registrationInput,
  loginInput,
} = require("../customMiddleware/validators/userValidator");
const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controllers/userController");

/* API REST /auth - Routes */

//POST request to register
router.post("/register", registrationInput, userRegister);

//POST request to login
router.post("/login", loginInput, userLogin);

// GET request to logout
router.post("/logout", loginRequired, userLogout);

// export to use in server.js
module.exports = router;
