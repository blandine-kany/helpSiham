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
    lowercase: true,
    required: "Email adress is required",
  },
  password: {
    type: String,
    trim: true,
    required: "Password is required",
  },
  position: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: String,
    enum: ["superAdmin", "admin", "user"],
    default: "user",
  },
  validAccount: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

//export
module.exports = User;
