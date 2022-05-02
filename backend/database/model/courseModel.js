const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseModel = new Schema({
  title: {
    type: String,
    trim: true,
    required: "A title is required",
  },
  courseId: {
    type: String,
    required: true,
    trim: true,
  },
  professor: {
    name: {
      last: {
        type: String,
        minlength: 3,
        trim: true,
        required: true,
      },
      first: {
        type: String,
        trim: true,
      },
    },
  },
  description: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// declares a model
const Course = mongoose.model("Course", courseModel);

//exports the model
module.exports = Course;
