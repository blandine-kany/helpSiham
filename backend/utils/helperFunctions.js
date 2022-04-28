const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

/**
 * Generates a JWT using arguments
 * @param {*} user_id
 * @returns
 */
function jwtGenerator(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

module.exports = { hashPassword, comparePassword, jwtGenerator };
