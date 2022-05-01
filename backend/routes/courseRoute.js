const express = require("express");
const router = express.Router();
const { loginRequired } = require("../utils/helperFunctions");
const {
  courseInput,
} = require("../customMiddleware/validators/courseValidator");

const {
  getAllCourses,
  createCourse,
  getStudent,
  deleteStudent,
  updateStudent,
  filterStudents,
} = require("../controllers/courseController");

/* API REST v1/courses - Routes */

// GET request to display all the students
router.get("/", getAllCourses);

// POST request to create a student
router.post("/", courseInput, createCourse);

// GET request to access a student's profile
router.get("/:studentId", getStudent);

// DELETE request to delete a student
router.delete("/:studentId", deleteStudent);

// PUT request to update a student
router.put("/:studentId", courseInput, updateStudent);

// POST request to filter students
router.post("/filter", filterStudents);

// export to use in server.js*/
module.exports = router;
