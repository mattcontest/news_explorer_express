const router = require("express").Router();
const userRouter = require("./users");
const articleRouter = require("./articles");
// const newsRoutes = require("./routes/news");
const { login, createUser } = require("../controllers/users");
const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/notFoundError");

// router.get("/crash-test", () => {
//   setTimeout(() => {
//     throw new Error("Server will crash now");
//   }, 0);
// });

// router.post("/signin", login);
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.use("/users", userRouter);
router.use("/articles", articleRouter);
// router.use("/api", newsRoutes);

router.use((req, res, next) => next(NotFoundError("Resource Not Found 404")));

module.exports = router;
