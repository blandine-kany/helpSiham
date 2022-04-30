/* Validation & Sanitisation for student input */

const { body, validationResult } = require("express-validator");
const logger = require("../../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

exports.studentInput = [
  // Check input for student object
  body("name.last", "Lastname can not be empty!").notEmpty().trim().escape(),
  body("major", "Major can not be empty!").notEmpty().trim().escape(),
  body("studentID", "Student ID can not be empty!").notEmpty().trim().escape(),
  body("dateOfBirthday", "Date of birth can not be empty!")
    .notEmpty()
    .trim()
    .escape(),
  body("email", "Invalid email address").notEmpty().trim().escape().isEmail(),
  body("role").trim().escape(),
  body("name.first").trim().escape(),

  // Process user input - check if there are errors
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = [];
    errors.array().map((err) => errorMessages.push(err.msg));
    // if an error is detected notify user
    if (!errors.isEmpty()) {
      logger.warn({ message: "Invalid input", error: errorMessages, filePath });
      return res.status(422).json(errorMessages);
    } else {
      logger.info({ message: "No input errors found", filePath });
    }
    next();
  },
];
