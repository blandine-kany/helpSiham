/* Validation & Sanitisation of user input */

const { body, validationResult } = require("express-validator");
const logger = require("../../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

// Validation chain that checks basic user input
const checkGenericInput = [
  body("name.last", "Lastname can not be empty!").notEmpty().trim().escape(),
  body("email", "Invalid email address").notEmpty().trim().escape().isEmail(),
  body("password", "Invalid password")
    .notEmpty()
    .trim()
    .escape()
    // check minimum length of password
    .isLength({
      min: 8,
    })
    // Custom message
    .withMessage(
      "Password must be at least 8 characters and contain at least one number, one special character, one lowercase and one uppercase letter."
    )
    // check if password contains a number
    .matches("[0-9]")
    .withMessage("Password must contain a number")
    // check if password contains an uppercase letter
    .matches("[A-Z]")
    .withMessage("Password must contain an uppercase letter")
    // if password contains an lowercase letter
    .matches("[a-z]")
    .withMessage("Password must contain a lowercase letter")
    // if password contains an lowercase letter
    .matches("[^a-zA-Z0-9]")
    .withMessage("Password must contain a special character"),
  body("confirmPassword", "Passwords do not match")
    .notEmpty()
    .trim()
    .escape()
    // checking if passwords match
    .custom((value, { req }) => value === req.body.password),
];

/**
 *  Validation chain to validate & sanitize user registration input
 */
exports.registrationInput = [
  // check generic user data (email, firstname etc.)
  checkGenericInput,
  // Process user input - check if there are errors
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = [];
    errors.array().map((err) => errorMessages.push(err.msg));

    // if an error is detected notify user
    if (!errors.isEmpty()) {
      logger.warn({
        message: "Invalid User input",
        error: errorMessages,
        filePath,
      });
      return res.status(422).json(errorMessages);
    } else {
      logger.info({ message: "No input errors found", filePath });
    }
    next();
  },
];

/**
 * Validation chain for user login input
 */
exports.loginInput = [
  body("email").notEmpty().trim().escape(),
  body("password").notEmpty().trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = [];

    errors.array().map((err) => errorMessages.push(err.msg));

    if (!errors.isEmpty()) {
      logger.warn({
        message: "Invalid Student input",
        error: errorMessages,
        filePath,
      });
      return res.status(422).json(errorMessages);
    } else {
      logger.info({ message: "No input errors found", filePath });
    }
    next();
  },
];

/**
 * validation chain for the new user information
 */
exports.updateInput = [
  body("name.last", "Lastname can not be empty!").notEmpty().trim().escape(),
  body("email", "Invalid email address").notEmpty().trim().escape().isEmail(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = [];
    errors
      .array({ onlyFirstError: true })
      .map((err) => errorMessages.push(err.msg));

    if (!errors.isEmpty()) {
      logger.warn({
        message: "Invalid Student input",
        error: errorMessages,
        filePath,
      });
      return res.status(422).json(errorMessages);
    } else {
      logger.info({ message: "No input errors found", filePath });
    }
    next();
  },
];
