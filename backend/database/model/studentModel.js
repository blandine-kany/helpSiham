const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    last: {
      type: String,
      trim: true,
      minlength: 3,
      required: [true, "Please fill the 'lastname' field"],
    },
    first: {
      type: String,
      trim: true,
    },
  },
  email: {
    type: String,
    minlength: 3,
    trim: true,
    unique: [true, "Email adress already exists in database!"],
    lowercase: true,
    required: [true, "Email adress required"],
  },
  major: {
    type: String,
    trim: true,
    required: [true, "Major required"],
  },
  role: {
    type: String,
    enum: ["representative", "normal"],
    default: "normal",
  },
  studentId: {
    type: String,
    unique: [true, "Student ID already exists in database!"],
    trim: true,
    required: "Student ID required",
  },
  dateOfBirthday: {
    type: Date,
    required: [true, "Date of birth required"],
  },
  dateOfInscription: {
    type: Date,
    default: Date.now,
  },
});

// declares a model
const Student = mongoose.model("Student", studentSchema);

//exports the model
module.exports = Student;
