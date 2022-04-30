const express = require("express");
const router = express.Router();
const { loginRequired } = require("../utils/helperFunctions");
const {
  studentInput,
} = require("../customMiddleware/validators/studentValidator");

const {
  getAllStudents,
  createStudent,
} = require("../controllers/studentController");
/* API REST v1/students - Routes */

// GET request to display all the students
router.get("/", getAllStudents);

// POST request to create a student
router.post("/", studentInput, createStudent);
/*
// PUT request to update a student
router.put("/:studentId", loginRequired, studentInput, updateStudent);

// GET request to access a student's profile
router.get("/:studentId", loginRequired, studentProfile);

// DELETE request to delete a student
router.delete("/:studentId", loginRequired, deleteStudent);

// POST request to filter students
router.post("/filter", loginRequired, filterStudents);

// export to use in server.js*/
module.exports = router;
