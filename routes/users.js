const router = require("express").Router();
const {
  getCurrentUser,
  createUser,
  getUsers,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/", getUsers);
router.get("/me", getCurrentUser);
module.exports = router;
