const User = require("../database/model/userModel");
const {
  hashPassword,
  comparePassword,
  jwtGenerator,
} = require("../utils/helperFunctions");

const getAllUsers = async (req, res) => {
  //let user = new User(req.body);
  console.log(req.session);
  User.find((error, users) => {
    if (error) {
      console.error(error);
    }
    res.json(users);
  });
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
    let newUser = new User({
      email,
      password: encryptedPassword,
      name,
      position,
    });

    //create new user
    newUser
      .save()
      .then((user) => {
        req.session.userId = user._id;
        console.log("New user  sent.");
        res.status(201).json({ msg: "Your request was sent succesfully." });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json("There was an error.");
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json("There was an error.");
  }
};

const deleteUser = async (req, res) => {
  User.findByIdAndDelete(req.body._id, (error, user) => {
    if (error) {
      console.error(error);
      res.status(400).json("There was an error.");
    }
    if (!user) {
      console.log("User" + req.body._id + "deleted succesfully.");
      res.status(400).json("User not found.");
    } else {
      console.log("UserId " + req.body._id + " - account deleted succesfully.");
      res.status(200).json("The account has been deleted successfully.");
    }
  });
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

    //check if password is the same as in the DB
    const isPasswordValid = await comparePassword(password, user.password);

    if (user && isPasswordValid) {
      /*const accessToken = jwtGenerator({ user_id: user._id, email });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });*/

      console.log("User successfully connected");
      req.session.userId = user._id;
      return res.status(200).json({ name: user.name, email });
    }

    res.status(401).json("Invalid Credentials");
  } catch (error) {
    console.error(error);
    res.status(500).json("There was an error");
  }
};

const userProfile = async (req, res) => {
  User.findById({ _id: req.body._id })
    .then((user) => {
      console.log("UserId" + req.body._id + " - information displayed");
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json("There was an error.");
    });
};

const updateUser = async (req, res) => {
  User.findByIdAndUpdate(req.body._id, { $set: req.body })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json("There was an error.");
    });
};

const loginRequired = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    console.log("User session not found");
    return res.status(403).json({ msg: "Authentication necessary" });
  }

  let user = await User.findById(req.session.userId);
  if (!user) {
    console.log("User ID not found");
    return res.status(403).json({ msg: "User not found" });
  }

  console.log(req.user);
  next();
};
module.exports = {
  getAllUsers,
  userLogout,
  userLogin,
  userRegister,
  userProfile,
  updateUser,
  deleteUser,
  loginRequired,
};
