const {
  getArticles,
  likeArticle,
  dislikeArticle,
  deleteArticle,
  createArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.use(auth);
router.get("/", getArticles);
router.delete("/:articleId", deleteArticle);
router.put("/:articleId/likes", likeArticle);
//But instead this?
router.post("/", createArticle);
router.delete("/:articleId/likes", dislikeArticle);

module.exports = router;
