const db = require("../database/db_connection");
const User = require("../database/model/userModel");

const getAllUsers = async (req, res) => {
  User.find((error, users) => {
    if (error) {
      console.error(error);
    }
    res.json(users);
  });
};

const userRegister = async (req, res) => {
  try {
    if (req.body) {
      let newUser = new User(req.body);
      newUser.save((error, user) => {
        if (error) {
          console.error(error);
          res.status(400).json("There was an error.");
        } else {
          console.log("New user request sent.");
          res.status(200).json("Your request has been sent successfully.");
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("There was an error.");
  }
};

const userLogout = async (req, res) => {};
const userLogin = async (req, res) => {};
const userProfile = async (req, res) => {};
const updateUser = async (req, res) => {};
const deleteUser = async (req, res) => {};

module.exports = {
  getAllUsers,
  userLogout,
  userLogin,
  userRegister,
  userProfile,
  updateUser,
  deleteUser,
};
