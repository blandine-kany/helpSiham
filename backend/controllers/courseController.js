const Course = require("../database/model/courseModel");
const logger = require("../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

exports.getAllCourses = async (req, res) => {
  Course.find((error, courses) => {
    if (error) {
      logger.error({ message: "There was an error", filePath, error });
      return res.status(500).json({ msg: "There was an error" });
    }
    if (!courses) {
      logger.warn({ message: "There was an error", filePath, error });
      return res.status(400).json({ msg: "There was an error" });
    }

    logger.info({
      message: "List of courses succesfully retreived.",
      filePath,
    });

    // Check if results is empty
    if (courses.length == 0) {
      return res
        .status(204)
        .json({ msg: "Succesfully retreived all data", courses });
    }
    return res
      .status(200)
      .json({ msg: "Succesfully retreived all courses", courses });
  });
};

exports.createCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseID = await Course.findOne({ courseId });
    if (courseID) {
      logger.info({
        message: "Invalid input - Course ID already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Course ID already exists." });
    }

    const newCourse = await Course.create(req.body);
    if (!newCourse) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        data: newCourse,
      });
      return res.status(422).json({ msg: "Something went wrong" });
    }

    logger.info({ message: "New Course created", data: newCourse, filePath });
    return res
      .status(201)
      .json({ msg: "New course was created successfully." });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "There was an error." });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Course.findByIdAndDelete(studentId);
    if (!student) {
      logger.warn({
        message: `Student ${studentId} not found`,
        filePath,
        data: student,
      });
      return res.status(404).json({ msg: `Student ${studentId} not found 😕` });
    }

    logger.info({
      message: `Student ${studentId} deleted`,
      filePath,
    });
    return res.status(204).json({ msg: "Student was deleted succesfully." });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentInfo = await Course.findById(studentId);

    if (!studentInfo) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        data: studentInfo,
      });
      return res.status(404).json({ msg: "Student not found" });
    }
    logger.info({
      message: `Student ${studentId} info retreived succesfully`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "Student info was retreived succesfully.", studentInfo });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const idToUpdate = req.params.studentId;
    const { email, studentId } = req.body;
    const studentEmail = await Course.findOne({ email });

    // check if student email already exists
    if (studentEmail && studentEmail._id.toString() != idToUpdate) {
      logger.info({
        message: "Invalid input - Student email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student email already exists." });
    }

    // check if student ID already exists
    const studentID = await Course.findOne({ studentId });
    if (studentID && studentID._id.toString() != idToUpdate) {
      logger.info({
        message: "Invalid input - Student ID already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student ID already exists." });
    }

    const studentUpdated = await Course.findByIdAndUpdate(
      idToUpdate,
      {
        $set: req.body,
      },
      { returnDocument: "after" }
    );

    if (!studentUpdated) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        data: studentUpdated,
      });
      return res.status(404).json({ msg: "Student not found" });
    }
    logger.info({
      message: `Student ${idToUpdate} info updated succesfully`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "Student info was updated succesfully.", studentUpdated });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.filterStudents = async (req, res) => {
  try {
    // Get filter criteria from body
    const filterKeys = Object.keys(req.body);
    const filterValues = Object.values(req.body);
    let filterQuery = {};

    // Create query with filter
    for (let i = 0; i < filterKeys.length; i++) {
      if (filterValues[i].length > 0) {
        // if filter criteria is dateOfBirth
        if (filterKeys[i] === "dateOfBirth") {
          // check if it is between 2 dates
          if (filterValues[i].length == 2) {
            filterQuery[filterKeys[i]] = {
              $gte: new Date(filterValues[i][0]),
              $lt: new Date(filterValues[i][1]),
            };
          } else {
            filterQuery[filterKeys[i]] = new Date(filterValues[i]);
          }
        } else {
          filterQuery[filterKeys[i]] = {
            // regex to get everything that contains the given expression
            $regex: `${filterValues[i]}`,
            $options: "i",
          };
        }
      }
    }

    const filteredStudents = await Course.find(filterQuery);
    if (!filteredStudents) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        data: filteredStudents,
      });
      return res.status(404).json({ msg: "Could not apply filter 😭" });
    }
    logger.info({
      message: `Filtered students were retreived succesfully.`,
      filePath,
    });
    return res.status(200).json({
      msg: "Filtered students were retreived succesfully.",
      filteredStudents,
    });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};
