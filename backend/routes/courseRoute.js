const express = require("express");
const router = express.Router();

// Import functions
const { loginRequired } = require("../utils/helperFunctions");
const {
  courseInput,
} = require("../customMiddleware/validators/courseValidator");

const {
  getAllCourses,
  createCourse,
  getCourse,
  deleteCourse,
  updateCourse,
  filterCourses,
} = require("../controllers/courseController");

/* API REST api/v1/courses/ - Routes */

// GET request to display all the courses
router.get("/", loginRequired, getAllCourses);

// POST request to create a course
router.post("/", loginRequired, courseInput, createCourse);

// GET request to access a course's info
router.get("/:courseId", loginRequired, getCourse);

// DELETE request to delete a course
router.delete("/:courseId", loginRequired, deleteCourse);

// PUT request to update a course
router.put("/:courseId", loginRequired, courseInput, updateCourse);

// POST request to filter courses
router.post("/filter", loginRequired, filterCourses);

// export to use in server.js*/
module.exports = router;
