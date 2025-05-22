const router = require("express").Router();
const { getCurrentUser, createUser } = require("../controllers/users");

// router.use(auth)
router.get("/me", getCurrentUser);
module.exports = router;
