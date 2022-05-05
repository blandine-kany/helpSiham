/* Validation & Sanitisation for student input */

const { body, validationResult } = require("express-validator");
const logger = require("../../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

exports.studentInput = [
  // Check input for student object
  body("name.last", "Lastname can not be empty!")
    // Check if field is empty
    .notEmpty()
    // To delete leading and trailing space
    .trim()
    // Escape specific characters HTML entities.
    .escape(),
  body("major", "Major can not be empty!").notEmpty().trim().escape(),
  body("studentId", "Student ID can not be empty!").notEmpty().trim().escape(),
  body("dateOfBirth", "Must be a valid date!")
    .trim()
    // Validate DOB to be a valid date
    .toDate("dd/mm/yyyy"),
  body("email", "Invalid email address").trim().escape().isEmail(),
  body("role", "Role must be a valid value")
    // Optional field
    .optional()
    .trim()
    .escape()
    // Check if the string is in a array of allowed values.
    .isIn(["classRepresentative", "normal"]),
  body("name.first").optional().trim().escape(),

  // Process user input - check if there are errors
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = [];
    console.log(req.body.dateOfBirth);
    errors.array().map((err) => errorMessages.push(err.msg));
    // if an error is detected notify user
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
