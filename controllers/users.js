const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

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

module.exports = { createUser, getCurrentUser };
