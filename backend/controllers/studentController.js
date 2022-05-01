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
    res
      .status(200)
      .json({ msg: "Succesfully retreived all Student data", students });
  });
};

exports.createStudent = async (req, res) => {
  try {
    const { email, studentId } = req.body;
    const studentEmail = await Student.findOne({ email });

    // check if student already exists
    if (studentEmail) {
      logger.info({
        message: "Invalid input - Student email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student email already exists." });
    }

    const studentID = await Student.findOne({ studentId });
    if (studentID) {
      logger.info({
        message: "Invalid input - Student ID already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student ID already exists." });
    }

    const newStudent = await Student.create(req.body);
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
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "There was an error." });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findByIdAndDelete(studentId);
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
    return res.status(200).json({ msg: "Student was deleted succesfully." });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.studentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentInfo = await Student.findById(studentId);

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
    const studentEmail = await Student.findOne({ email });

    // check if student email already exists
    if (studentEmail && studentEmail._id.toString() != idToUpdate) {
      logger.info({
        message: "Invalid input - Student email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student email already exists." });
    }

    // check if student ID already exists
    const studentID = await Student.findOne({ studentId });
    if (studentID && studentID._id.toString() != idToUpdate) {
      logger.info({
        message: "Invalid input - Student ID already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Student ID already exists." });
    }

    console.log(req.body);
    const studentUpdated = await Student.findByIdAndUpdate(
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
