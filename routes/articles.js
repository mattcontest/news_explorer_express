const { getArticles } = require("../controllers/articles");

const router = require("express").Router();

router.get("/", getArticles);

module.exports = router;
