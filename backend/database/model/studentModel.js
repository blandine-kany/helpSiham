const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstName: {
    type: String,
    minlength: 3,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    trim: true,
    required: "Lastname is required",
  },
  email: {
    type: String,
    minlength: 3,
    trim: true,
    unique: true,
    lowercase: true,
    required: "Email adress is required",
    /*validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],*/
  },
  password: {
    type: String,
    trim: true,
    required: "Password is required",
  },
  course: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["admin", "user"],
  },
  student_id: {
    type: String,
    unique: true,
    trim: true,
    required: "Student ID required",
  },
  dateOfBirthday: {
    type: Date,
    required: "Date of birth is required",
  },
  dateOfInscription: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model("Student", studentSchema);

//export
module.exports = Student;
