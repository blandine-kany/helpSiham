const { response } = require("express");
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

module.exports = { getAllUsers };
