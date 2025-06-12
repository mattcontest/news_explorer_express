const router = require("express").Router();
const {
  getCurrentUser,
  createUser,
  getUsers,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

console.log("🛡️ Auth Middleware triggered");
router.get("/", getUsers);
router.use(auth);
router.get("/me", getCurrentUser);
module.exports = router;
