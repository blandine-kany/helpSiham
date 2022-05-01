const express = require("express");
const router = express.Router();

// Import functions
const { loginRequired } = require("../utils/helperFunctions");
const { updateInput } = require("../customMiddleware/validators/userValidator");
const {
  getAllUsers,
  userRegister,
  userLogin,
  userLogout,
  userProfile,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

/* API REST users/v1 - Routes */

// GET request to display all the users
router.get("/", loginRequired, getAllUsers);

// PATCH request to update user's profile
router.patch("/profile", loginRequired, updateInput, updateUser);
router.patch("/:userId", loginRequired, updateInput, updateUser);

// GET request to access user's profile
router.get("/profile", loginRequired, userProfile);
router.get("/:userId", loginRequired, userProfile);

// DELETE request to delete a user account
router.delete("/profile", loginRequired, deleteUser);
router.delete("/:userId", loginRequired, deleteUser);

// export to use in server.js
module.exports = router;
