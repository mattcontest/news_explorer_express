const router = require("express").Router();

const userRouter = require("./users");
const articleRouter = require("./articles");
const { login, createUser } = require("../controllers/users");

// router.get("/crash-test", () => {
//   setTimeout(() => {
//     throw new Error("Server will crash now");
//   }, 0);
// });

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/articles", articleRouter);

router.use((req, res, next) => {
  res.status(404).send({ message: "Resource Not Found 404" });
});

module.exports = router;
