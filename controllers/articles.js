const Article = require("../models/article");

const getArticles = (req, res, next) => {
  const currentUser = req.user._id;
  Article.find({ owner: currentUser })
    .then((article) => res.status(200).send({ data: article }))
    .catch((err) => {
      return res.status(404).send({ message: "404 Articels not found" });
    });
};

const createArticle = (req, res, next) => {
  const { keyword, title, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword,
    title,
    date,
    source,
    link,
    image,
  }).then((article) =>
    res
      .status(201)
      .send({ data: article })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          res.status(400).send({ message: "Invalid data" });
        }
      })
  );
};

const deleteArticle = (req, res, next) => {
  const [articleId] = req.params;
  Article.findOne({ _id: articleId })
    .orFail()
    .then((article) => {
      if (article.owner.toString() != req.user._id) {
        res
          .status(403)
          .send({ message: "Unauthorized to delete this article" });
      }
    });
  return Article.deleteOne({ _id: articleId })
    .orFail()
    .then(() => res.status(200).send({ data: article }))
    .catch((err) => console.error(err));
};

module.exports = { getArticles, createArticle, deleteArticle };
