/* Validation & Sanitisation for student input */

const { body, validationResult } = require("express-validator");
const logger = require("../../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

exports.courseInput = [
  body("title", "Title can not be empty!").notEmpty().trim().escape(),
  body("professor.name.last", "Lastname can not be empty!")
    .notEmpty()
    .trim()
    .escape(),
  body("courseId", "Course ID can not be empty!").notEmpty().trim().escape(),
  body("description").optional().trim().escape(),
  body("professor.name.first").optional().trim().escape(),

  // Process user input - check if there are errors
  async (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = [];
    errors.array().map((err) => errorMessages.push(err.msg));
    // if an error is detected notify user
    if (!errors.isEmpty()) {
      logger.warn({
        message: "Invalid Course input",
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
