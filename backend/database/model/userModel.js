const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    minlength: 3,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    trim: true,
    required: "Please fill the 'lastname' field",
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
  position: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["admin", "user"],
  },
  valid: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

//export
module.exports = User;
