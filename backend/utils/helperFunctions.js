const bcrypt = require("bcryptjs");
const User = require("../database/model/userModel");
const logger = require("../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

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
    logger.warn({
      message: `There was an error`,
      filePath,
    });
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
    logger.warn({
      message: `There was an error`,
      filePath,
    });
  }

  // Return false if error
  return false;
}

async function loginRequired(req, res, next) {
  if (!req.session || !req.session.userId) {
    logger.warn({
      message: `User session not found`,
      filePath,
    });
    return res.status(403).json({ msg: "Authentication necessary" });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    logger.warn({
      message: `User not found`,
      filePath,
    });
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.validAccount == 0) {
    logger.info({
      message: `User not authorized yet`,
      filePath,
    });
    return res.status(401).json({ msg: "User not authorized yet." });
  }
  next();
}

module.exports = { hashPassword, comparePassword, loginRequired };
