const router = require("express").Router();
const {
  getArticles,
  likeArticle,
  deleteArticle,
  createArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");
const {
  validateArticle,
  validateArticleId,
} = require("../middlewares/validation");

router.use(auth);
router.get("/", getArticles);
router.delete("/:articleId", validateArticleId, deleteArticle);
router.put("/:articleId/likes", validateArticle, likeArticle);
//  But instead this?
router.post("/", validateArticle, createArticle);
// router.delete("/:articleId/likes", dislikeArticle);

module.exports = router;
