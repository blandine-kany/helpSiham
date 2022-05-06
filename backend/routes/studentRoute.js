const express = require("express");
const router = express.Router();

// Import functions
const { loginRequired } = require("../utils/helperFunctions");
const {
  studentInput,
} = require("../customMiddleware/validators/studentValidator");

const {
  getAllStudents,
  createStudent,
  getStudent,
  deleteStudent,
  updateStudent,
  filterStudents,
} = require("../controllers/studentController");

/* API REST api/v1/students - Routes */

// GET request to display all the students
router.get("/", loginRequired, getAllStudents);

// POST request to create a student
router.post("/", loginRequired, studentInput, createStudent);

// GET request to access a student's profile
router.get("/:studentId", loginRequired, getStudent);

// DELETE request to delete a student
router.delete("/:studentId", loginRequired, deleteStudent);

// PUT request to update a student
router.put("/:studentId", loginRequired, studentInput, updateStudent);

// POST request to filter students
router.post("/filter", loginRequired, filterStudents);

// export to use in server.js*/
module.exports = router;
