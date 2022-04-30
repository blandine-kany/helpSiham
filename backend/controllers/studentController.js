const Student = require("../database/model/studentModel");
const logger = require("../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

exports.getAllStudents = async (req, res) => {
  Student.find((error, students) => {
    if (error) {
      logger.error({ message: "There was an error", filePath, error });
      return res.status(500).json({ msg: "There was an error" });
    }
    if (!students) {
      logger.warn({ message: "There was an error", filePath, error });
      return res.status(400).json({ msg: "There was an error" });
    }

    logger.info({
      message: "List of students succesfully retreived.",
      filePath,
    });

    // Check if results is empty
    if (students.length == 0) {
      return res
        .status(204)
        .json({ msg: "Succesfully retreived all data", students });
    }
    res.status(200).json({ msg: "Succesfully retreived all data", students });
  });
};

exports.createStudent = async (req, res) => {
  try {
    const { email, studentId } = req.body;
    const studentEmail = await User.findOne({ email });

    // check if student already exists
    if (studentEmail) {
      logger.info({
        message: "Invalid input - User email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student email already exists." });
    }

    const studentID = await User.findOne({ studentId });
    if (studentID) {
      logger.info({
        message: "Invalid input - User email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student ID already exists." });
    }

    const newStudent = await User.create(req.body);
    if (!newStudent) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        data: newStudent,
      });
      return res.status(422).json({ msg: "Something went wrong" });
    }

    logger.info({ message: "New Student created", data: newStudent, filePath });
    return res
      .status(201)
      .json({ msg: "New student was created succesfully." });
  } catch (error) {
    logger.error({error, filePath});
    return res.status(500).json({ msg: "There was an error." });
  }
};
