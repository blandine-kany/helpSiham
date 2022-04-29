const bcrypt = require("bcryptjs");
const User = require("../database/model/userModel");

/**
 * Function that hashes a given string using the bcrypt library
 * @param {*} password
 * @param {*} saltRounds
 * @returns
 */
async function hashPassword(password, saltRounds = 10) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash password
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Function that compares a given string and a given hash so
 * to check if the string corresponds to the hash
 * @param {*} password
 * @param {*} hash
 * @returns
 */
async function comparePassword(password, hash) {
  try {
    // Compare password
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }

  // Return false if error
  return false;
}

async function loginRequired(req, res, next) {
  if (!req.session || !req.session.userId) {
    console.log("User session not found");
    return res.status(403).json({ msg: "Authentication necessary" });
  }

  let user = await User.findById(req.session.userId);
  if (!user) {
    console.log("User ID not found");
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.validAccount == 0) {
    console.log("User not authorized yet");
    return res.status(401).json({ msg: "User not authorized yet." });
  }
  next();
}

module.exports = { hashPassword, comparePassword, loginRequired };
