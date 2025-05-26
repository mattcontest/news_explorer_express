const {
  getArticles,
  likeArticle,
  dislikeArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", getArticles);
router.use(auth);
router.put("/:articleId/likes", likeArticle);
router.delete("/:articleId/likes", dislikeArticle);

module.exports = router;
