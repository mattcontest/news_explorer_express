const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res, next) => {
  // if (!req.user) {
  //   return res.status(401).send({ message: "Authorization required" });
  // }
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({
        message: "500 Server Error when attempting downloading users",
      });
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log("Req.body", name, email);
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already used" });
      }

      if (err.name == "ValidationError") {
        return res
          .status(400)
          .send({ message: "400 Bad Request when creating a user" });
      }

      return res
        .status(500)
        .send({ message: "500 Server Error when creating  a user" });
    });
};

const getCurrentUser = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .send({ message: "Authorization required, first log in" });
  }
  const { _id: userId } = req.user;
  console.log("req.user", req.user);
  console.log("Req.params current user", userId);
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: `Bad Request  -- Cast Error when getUserById` });
      }

      return res
        .status(500)
        .send({ message: "500 Server Error when attempting to getUserById" });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Both email and password are required!" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Sending", {
        token,
        name: user.name,
        email: user.email,
        _id: user._id,
      });
      res.send({ token, name: user.name, email: user.email, _id: user._id });
    })
    .catch((err) => {
      if (err.message.includes("Incorrect email or password")) {
        return res
          .status(401)
          .send({ message: "Incorrect email or password ~ 401" });
      }
      // next(err)
    });
};

module.exports = { createUser, getCurrentUser, login, getUsers };
