const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflictError");
const BadRequestError = require("../errors/badRequestError");
const UnauthorizedError = require("../errors/unauthorizedError");
const NotFoundError = require("../errors/notFoundError");

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
        // return res.status(409).send({ message: "Email already used" });
        next(new ConflictError("Email already used"));
      }

      if (err.name === "ValidationError") {
        // return res
        //   .status(400)
        //   .send({ message: "400 Bad Request when creating a user" });
        next(new BadRequestError("Bad Request when creating a user"));
      }

      return res
        .status(500)
        .send({ message: "500 Server Error when creating  a user" });
    });
};

const getCurrentUser = (req, res, next) => {
  if (!req.user) {
    // return res
    //   .status(401)
    //   .send({ message: "Authorization required, first log in" });
    next(new UnauthorizedError("Authorization required, first log in"));
  }
  const { _id: userId } = req.user;
  console.log("req.user", req.user);
  console.log("Req.params current user", userId);
  return (
    User.findById(userId)
      // .orFail()
      .then((user) => {
        if (!user) {
          // return res.status(404).send({ message: "User not found" });
          next(new NotFoundError("User not found"));
        }
        return res.status(200).send(user);
      })

      .catch((err) => {
        // if (res.headerSent) {
        //   return;
        // }

        if (err.name === "CastError") {
          // return res
          //   .status(400)
          //   .send({ message: `Bad Request  -- Cast Error when getUserById` });
          next(
            new BadRequestError("Bad Request  -- Cast Error when getUserById")
          );
        }

        return res
          .status(500)
          .send({ message: "500 Server Error when attempting to getUserById" });
      })
  );
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res
    //   .status(400)
    //   .send({ message: "Both email and password are required!" });
    next(new BadRequestError("Both email and password are required!"));
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
      res.send({
        token,
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      console.error("Login error:", err);

      if (err.message.includes("Incorrect email or password")) {
        // return res
        //   .status(401)
        //   .send({ message: "Incorrect email or password ~ 401" });
        next(
          new UnauthorizedError(
            "Unathorized access: Incorrect email or password ~ 401"
          )
        );
      }

      // return res
      //   .status(500)
      //   .send({ message: "Server error during login", error: err.message });
      next(err);
      // next(err)
    });
};

module.exports = { createUser, getCurrentUser, login, getUsers };
