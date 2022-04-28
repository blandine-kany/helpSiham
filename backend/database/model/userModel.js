const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    required: [true, "Email adress is required"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
  },
  position: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "user"],
    default: "user",
  },
  validAccount: {
    type: Number,
    enum: [0, 1],
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
