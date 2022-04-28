const express = require("express");
const router = express.Router();

// Require controller module
const userController = require("../controllers/userController");

/* API REST v1/users - Routes */

// GET request to display all the users
router.get("/", userController.loginRequired, userController.getAllUsers); //status verification

//POST request to register
router.post("/register", userController.userRegister);

//POST request to login
router.post("/login", userController.userLogin);

// GET request to logout
router.post("/logout", userController.loginRequired, userController.userLogout);

//GET request to access user's profile
router.get(
  "/profile",
  userController.loginRequired,
  userController.userProfile
);

//PUT request to update user's profile
router.patch(
  "/profile",
  userController.loginRequired,
  userController.updateUser
);

/*GET request to access user's profile
router.get("/:userId", userController.userProfile);*/

//DELETE request to delete a user account
router.delete(
  "/profile",
  userController.loginRequired,
  userController.deleteUser
);

// export to use in server.js
module.exports = router;
