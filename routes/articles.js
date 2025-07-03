const router = require("express").Router();
const {
  getArticles,
  likeArticle,
  deleteArticle,
  createArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/", getArticles);
router.delete("/:articleId", deleteArticle);
router.put("/:articleId/likes", likeArticle);
//  But instead this?
router.post("/", createArticle);
// router.delete("/:articleId/likes", dislikeArticle);

module.exports = router;
