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
  userLogged,
} = require("../controllers/userController");

/* API REST api/v1/auth - Routes */

// POST request to register
router.post("/register", registrationInput, userRegister);

// POST request to login
router.post("/login", loginInput, userLogin);

// GET request to logout
router.get("/logout", loginRequired, userLogout);

// GET request to verify authentication status
router.get("/islogged", loginRequired, userLogged);

// export to use in server.js
module.exports = router;
