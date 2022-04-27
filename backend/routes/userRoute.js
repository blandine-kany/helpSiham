const express = require("express");
const router = express.Router();

// Require controller module
const userController = require("../controllers/userController");

/* API REST v1/users - Routes */

//POST request to register
router.post("/register", userController.userRegister);

// GET request to display all the users
router.get("/users", userController.getAllUsers); //status verification

// GET request to logout
router.post("/logout", userController.userLogout);

//GET request to access user's profile
router.get("/profile", userController.userProfile);

//PUT request to update user's profile
router.patch("/profile", userController.updateUser);

//DELETE request to delete a user account
router.delete("/profile", userController.deleteUser);

// export to use in server.js
module.exports = router;
