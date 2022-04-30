const User = require("../database/model/userModel");
const { hashPassword, comparePassword } = require("../utils/helperFunctions");

const getAllUsers = async (req, res) => {
  try {
    isRoleValid = await checkRole(req);
    if (isRoleValid) {
      const users = await User.find();
      if (!users) {
        console.error("There was an error");
        return res.status(400).json({ msg: "There was an error" });
      }
      return res
        .status(200)
        .json({ msg: "Succesfully retreived all the users", users });
    } else {
      return res.status(403).json({ msg: "You are not authorized." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "There was an error" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { email, password, name, position } = req.body;
    const userExists = await User.findOne({ email });

    // check if user already exist
    if (userExists) {
      console.log("Invalid input - User email already exists");
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
      console.error(error);
      return res.status(422).json({ msg: "There was an error." });
    }

    console.log("New user request sent.");
    return res.status(201).json({ msg: "Your request was sent succesfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "There was an error." });
  }
};

const userLogout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.status(400).json("There was an error - Failure to logout.");
    }
    console.log("User successfully logged out");
    res.status(200).json({ msg: "You have been logged out." });
  });
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid input - User email does not exist");
      return res.status(404).json({ msg: "User not found." });
    }

    //check if password is the same as in the DB
    const isPasswordValid = await comparePassword(password, user.password);

    if (user && isPasswordValid) {
      if (user.validAccount == 0) {
        console.log("User not authorized yet");
        return res.status(401).json({ msg: "User not authorized yet." });
      }
      console.log("User successfully connected");
      req.session.userId = user._id;
      return res.status(200).json({ name: user.name, email });
    }

    return res.status(401).json({ msg: "Invalid Credentials" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "There was an error" });
  }
};

const userProfile = async (req, res) => {
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
        console.log("User not authorized to access this information.");
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
      console.error(`User ${userId} not found`);
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(`User ${userId} information sent`);
    return res
      .status(200)
      .json({ msg: "User information succesfully retreived", userInfo });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "There was an error." });
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
      console.log("User not authorized to delete this information.");
      return res.status(401).json({ msg: "User not authorized." });
    }
  }

  User.findByIdAndDelete(idTodelete, (error, userToDelete) => {
    if (error) {
      console.error(error);
      res.status(500).json("There was an error.");
    }
    if (!userToDelete) {
      console.log(`User ${idTodelete} not found.`);
      res.status(404).json({ msg: "User not found." });
    } else {
      console.log(`User ${idTodelete} - account deleted succesfully.`);
      if (!differentUser) {
        req.session.destroy((error) => {
          if (error) {
            console.error(error);
            return res.json(
              "There was an error - Failure to delete the account."
            );
          }
        });
      }
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
        console.log("User not authorized to modify this information.");
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
      console.log("Invalid input - User email already exists");
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
      console.error(`User ${idToUpdate} was not updated`);
      return res.status(400).json({
        msg: "There was an error while communicating with the database ",
      });
    }
    console.log(`User ${idToUpdate} information updated`);

    return res
      .status(200)
      .json({ msg: "User information succesfully updated", userUpdated });
  } catch (error) {
    console.error(error);
    return res.status(500).json("There was an error.");
  }
};

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
  userProfile,
  updateUser,
  deleteUser,
};
