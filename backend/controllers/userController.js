const User = require("../database/model/userModel");
const { hashPassword, comparePassword } = require("../utils/helperFunctions");
const logger = require("../config/logger");
const path = require("path");
const filePath = path.relative(__dirname + "/..", __filename);

const getAllUsers = async (req, res) => {
  try {
    isRoleValid = await checkRole(req);
    if (isRoleValid) {
      const users = await User.find();
      if (!users) {
        logger.warn({
          message: `There was an error`,
          filePath,
        });
        return res.status(400).json({ msg: "There was an error" });
      }

      logger.info({
        message: "List of users successfully retrieved.",
        filePath,
      });

      return res
        .status(200)
        .json({ msg: "Successfully retrieved all the users", users });
    } else {
      logger.warn({
        message: `User ${req.session.userId} not authorized`,
        filePath,
      });
      return res.status(403).json({ msg: "You are not authorized." });
    }
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { email, password, name, position } = req.body;
    const userExists = await User.findOne({ email });

    // check if user already exist
    if (userExists) {
      logger.info({
        message: "Invalid input - User email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "User email already exists." });
    }

    //hash password
    encryptedPassword = await hashPassword(password);

    //create new user
    let newUser = await User.create({
      email,
      password: encryptedPassword,
      name,
      position,
    });

    if (!newUser) {
      logger.warn({
        message: "Something went wrong - Request not processed",
        filePath,
        error: newUser,
      });
      return res.status(422).json({ msg: "There was an error." });
    }

    logger.info({
      message: "New user request sent.",
      data: newUser,
      filePath,
    });
    return res.status(201).json({ msg: "Your request was sent successfully." });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

const userLogout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      logger.error({ message: " ", filePath, error });
      return res
        .status(400)
        .json({ msg: "There was an error - Failure to logout." });
    }
    logger.info({ message: "User successfully logged out", filePath });
    res.status(200).json({ msg: "You have been logged out." });
  });
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.info({
        message: "Invalid input - User email does not exist",
        filePath,
      });
      return res.status(404).json({ msg: "User not found." });
    }

    //check if password is the same as in the DB
    const isPasswordValid = await comparePassword(password, user.password);

    if (user && isPasswordValid) {
      if (user.validAccount == 0) {
        logger.info({
          message: "User not authorized yet",
          filePath,
        });
        return res.status(401).json({ msg: "User not authorized yet." });
      }

      req.session.userId = user._id;
      logger.info({
        message: `User ${user._id} successfully connected`,
        filePath,
      });
      return res.status(200).json({ name: user.name, email, role: user.role });
    }

    logger.info({
      message: "Invalid Credentials",
      filePath,
    });
    return res.status(401).json({ msg: "Invalid Credentials" });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

const getUser = async (req, res) => {
  try {
    let userId = req.session.userId;
    let query;
    let userInfo;

    // if userId exists
    if (req.params.userId) {
      // check user role
      isRoleValid = await checkRole(req);
      if (isRoleValid) {
        userId = req.params.userId;
        query = await User.findById(userId);
        if (query) {
          userInfo = (({ name, email, position, role, validAccount }) => ({
            name,
            email,
            position,
            role,
            validAccount,
          }))(query);
        }
      } else {
        logger.info({
          message: "User not authorized to access this information.",
          filePath,
        });
        return res
          .status(401)
          .json({ msg: "User not authorized to access this information." });
      }
    } else {
      query = await User.findById(userId);
      if (query) {
        userInfo = (({ name, email, position, role, password }) => ({
          name,
          email,
          position,
          role,
          password,
        }))(query);
      }
    }

    if (!userInfo) {
      logger.warn({
        message: `User ${userId} not found`,
        filePath,
      });
      return res.status(404).json({ msg: "User not found" });
    }
    logger.info({
      message: `User ${userId} information retrieved successfully`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "User information  retrieved", userInfo });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.session.userId);
  let idTodelete = req.session.userId;
  let differentUser = false;

  if (req.params.userId) {
    differentUser = true;
    if (user && user.role === "superAdmin") {
      idTodelete = req.params.userId;
    } else {
      logger.info({
        message: `User ${req.params.userId} not authorized to delete this information.`,
        filePath,
      });
      return res.status(401).json({ msg: "User not authorized." });
    }
  }

  User.findByIdAndDelete(idTodelete, (error, userToDelete) => {
    if (error) {
      logger.error({ message: " ", filePath, error });
      return res
        .status(500)
        .json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
    }
    if (!userToDelete) {
      logger.warn({
        message: `User ${idTodelete} not found.`,
        filePath,
      });
      return res.status(404).json({ msg: "User not found." });
    } else {
      if (!differentUser) {
        req.session.destroy((error) => {
          if (error) {
            logger.error({ message: " ", filePath, error });
            return res.status(500).json({
              msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭\nFailure to logout the account.",
            });
          }
        });
      }
      logger.info({
        message: `User ${idTodelete} - account deleted successfully.`,
        filePath,
      });
      return res
        .status(200)
        .json({ msg: "The account has been deleted successfully." });
    }
  });
};

const updateUser = async (req, res) => {
  try {
    let idToUpdate = req.session.userId;
    const bodyToUpdate = req.body;

    // if user role superAdmin or admin then can modify some of the other user's info
    if (req.params.userId) {
      isRoleValid = await checkRole(req);
      if (isRoleValid) {
        idToUpdate = req.params.userId;
        delete bodyToUpdate.email;
        delete bodyToUpdate.password;
      } else {
        logger.info({
          message: `User ${req.params.userId} not authorized to modify this information.`,
          filePath,
        });
        return res.status(401).json({ msg: "User not authorized." });
      }
    } else {
      delete bodyToUpdate.role;
      delete bodyToUpdate.validAccount;
    }

    if (bodyToUpdate.password) {
      encryptedPassword = await hashPassword(bodyToUpdate.password);
      bodyToUpdate.password = encryptedPassword;
    }

    // check if user already exist
    const userExists = await User.findOne({ email: bodyToUpdate.email });
    if (userExists && userExists._id != idToUpdate) {
      logger.info({
        message: "Invalid input - User email already exists",
        filePath,
      });
      return res.status(409).json({ msg: "User email already exists." });
    }

    let userUpdated = await User.findByIdAndUpdate(
      idToUpdate,
      {
        $set: bodyToUpdate,
      },
      { returnDocument: "after" }
    );

    if (!userUpdated) {
      logger.warn({
        message: `User ${idToUpdate} was not updated`,
        filePath,
      });
      return res.status(400).json({
        msg: "User not found ",
      });
    }
    logger.info({
      message: `User ${idToUpdate} information updated`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "User information successfully updated", userUpdated });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

const userLogged = async (req, res) => {
  try {
    // gets user information
    const user = await User.findById(req.session.userId);

    // deletes unnecessary user information
    user.password = undefined;
    user.validAccount = undefined;
    user.created_at = undefined;

    req.session.userId = user._id;
    logger.info({
      message: `User ${user._id} information retrieved successfully`,
      filePath,
    });
    return res
      .status(200)
      .json({ msg: "User information successfully retrieved", user });
  } catch (error) {
    logger.error({ message: " ", filePath, error });
    return res.status(500).json({ msg: "AAAAAAAAAH THERE WAS AN ERROR 😭😭" });
  }
};

/**
 * Checks if the role of a user is "superAdmin" or "admin"
 *
 * @param {*} req
 * @returns - boolean
 */
async function checkRole(req) {
  const user = await User.findById(req.session.userId);
  if (user && user.role === ("superAdmin" || "admin")) {
    return true;
  }
  return false;
}

// export functions
module.exports = {
  getAllUsers,
  userLogout,
  userLogin,
  userRegister,
  getUser,
  updateUser,
  deleteUser,
  userLogged,
};
