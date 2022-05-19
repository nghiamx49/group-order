const express = require("express");
const authRoute = express.Router();
const db = require("../services/service");
const passport = require("passport");
const Jwt = require("jsonwebtoken");
const { Role, User } = db;

const signToken = (userId) => {
  return Jwt.sign(
    {
      issues: "TAM-Application",
      subject: userId,
    },
    process.env.SECRET_KEY,
    { expiresIn: "86400s" }
  );
};

authRoute.post("/register", async (req, res, next) => {
  const { username, password, fullname, image, roleId } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      mesError: true,
      isCreated: false,
      message: { mesBody: "Missing username or password" },
    });
  }
  if (!fullname) {
    return res.status(400).json({
      mesError: true,
      isCreated: false,
      message: { mesBody: "Please Input Your Name!" },
    });
  }
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        status: 400,
        mesError: true,
        isCreated: false,
        message: { mesBody: "UserName Already Exists!" },
      });
    } else {
      const userRoleId = await Role.findOne({ name: process.env.CUSTOMER });
      const newUser = new User({
        username,
        password,
        fullname,
        roleId: userRoleId._id,
      });
      await newUser.save();
      res.status(201).json({
        status: 201,
        message: "Register successfully",
        user: newUser,
        isCreated: true,
        mesError: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

authRoute.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      const { _id, username, roleId, fullname } = req.user;
      const findRole = await Role.findById(roleId);
      const role = findRole.name;
      const token = signToken(_id);
      res.status(200).json({
        status: 200,
        isAuthenticated: true,
        token,
        data: {
          _id,
          username,
          fullname,
          role,
          token,
        },
      });
      next();
    } else {
      res.status(401).json({
        message: { mesBody: "Unauthorized" },
        mesError: true,
        status: 401,
        isAuthenticated: false,
      });
    }
  }
);

authRoute.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { _id, username, fullname, image } = req.user;

      res.status(200).json({
        isAuthenticated: true,
        user: { _id, username, fullname, image },
      });
    } catch (error) {
      res.status(500).json({ message: { mesBody: "Errors" }, mesError: true });
    }
  }
);

authRoute.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const userInDb = await User.findByIdAndUpdate(req.user._id);
    if (userInDb) {
      userInDb.fullname = req.body.fullname || userInDb.fullname;
      userInDb.image = req.body.image || userInDb.image;
      userInDb.password = req.body.password || userInDb.password;

      const updateUser = await userInDb.save();
      res.send({
        _id: updateUser._id,
        username: userInDb.username,
        fullname: updateUser.fullname,
        image: updateUser.image,
        password: updateUser.password,
      });
    }
  }
);

authRoute.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access-token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

module.exports = authRoute;
