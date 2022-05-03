const Course = require("../database/model/courseModel");
const logger = require("../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

exports.getAllCourses = async (req, res) => {
  Course.find((error, courses) => {
    if (error) {
      logger.error({ message: " ", filePath, error });
      return res
        .status(500)
        .json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
    }
    if (!courses) {
      logger.warn({ message: "There was an error", filePath, error });
      return res.status(400).json({ msg: "There was an error" });
    }

    logger.info({
      message: "List of courses successfully retrieved.",
      filePath,
    });

    // Check if result is empty
    if (courses.length == 0) {
      return res
        .status(204)
        .json({ msg: "successfully retrieved all data", courses });
    }
    return res
      .status(200)
      .json({ msg: "successfully retrieved all courses", courses });
  });
};

exports.createCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // check if course ID already exists
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
        message: "Something went wrong - Request not processed",
        filePath,
        error: newCourse,
      });
      return res.status(422).json({ msg: "Something went wrong" });
    }

    logger.info({ message: "New Course created", data: newCourse, filePath });
    return res
      .status(201)
      .json({ msg: "New course was created successfully." });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      logger.warn({
        message: `Course ${courseId} not found`,
        filePath,
        error: course,
      });
      return res.status(404).json({ msg: `Course ${courseId} not found 😕` });
    }

    logger.info({
      message: `Course ${courseId} deleted`,
      filePath,
    });
    return res.status(200).json({ msg: "Course was deleted successfully." });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseInfo = await Course.findById(courseId);

    if (!courseInfo) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        error: courseInfo,
      });
      return res.status(404).json({ msg: "Course not found" });
    }
    logger.info({
      message: `Course ${courseId} info retrieved successfully`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "Course info was retrieved successfully.", courseInfo });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const idToUpdate = req.params.courseId;
    const { courseId } = req.body;

    // check if course ID already exists
    const courseID = await Course.findOne({ courseId });
    if (courseID) {
      logger.info({
        message: "Invalid input - Course ID already exists",
        filePath,
      });
      return res.status(409).json({ msg: "Course ID already exists." });
    }

    const courseUpdated = await Course.findByIdAndUpdate(
      idToUpdate,
      {
        $set: req.body,
      },
      { returnDocument: "after" }
    );

    if (!courseUpdated) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        error: courseUpdated,
      });
      return res.status(404).json({ msg: "Course not found" });
    }
    logger.info({
      message: `Course ${idToUpdate} info updated successfully`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "Course info was updated successfully.", courseUpdated });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

exports.filterCourses = async (req, res) => {
  try {
    // Get filter criteria from body
    const filterKeys = Object.keys(req.body);
    const filterValues = Object.values(req.body);
    let filterQuery = {};

    // Create query with filter criteria
    for (let i = 0; i < filterKeys.length; i++) {
      filterQuery[filterKeys[i]] = {
        // regex to get everything that contains the given expression
        $regex: `${filterValues[i]}`,
        $options: "i",
      };
    }

    const filteredCourses = await Course.find(filterQuery);
    if (!filteredCourses) {
      logger.warn({
        message: "Something went wrong",
        filePath,
        error: filteredCourses,
      });
      return res.status(404).json({ msg: "Could not apply filter 😭" });
    }

    logger.info({
      message: `Filtered courses were retrieved successfully.`,
      filePath,
    });

    // Check if result is empty
    if (filteredCourses.length == 0) {
      return res
        .status(204)
        .json({ msg: "No results to show", st });
    }

    return res.status(200).json({
      msg: "Filtered courses were retrieved successfully.",
      filteredCourses,
    });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};
