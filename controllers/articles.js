const { default: mongoose } = require("mongoose");
const Article = require("../models/article");

const getArticles = (req, res, next) => {
  console.log("Check req.user from getArticles", req.user);
  console.log("Check req.route from getArticles", req.route);
  if (!req.user) {
    return res
      .status(401)
      .send({ message: "Not logged in, please log in first!" });
  }
  console.log(req.user);
  const currentUser = req.user._id;

  return Article.find({ owner: currentUser })
    .populate("owner")
    .then((article) => res.status(200).send({ data: article }))
    .catch(() => res.status(500).send({ message: "404 Articels not found" }));
};

const createArticle = (req, res, next) => {
  const { keyword, title, date, source, link, image, text } = req.body;
  const owner = req.user._id;
  console.log("red.user._id", owner);

  Article.findOne({ link, owner })
    .then((existingArticle) => {
      if (existingArticle) {
        return res
          .status(409)
          .send({ message: "Article already saved in your Bookmarks!" });
      }
      return Article.create({
        keyword,
        title,
        date,
        source,
        link,
        image,
        text,
        owner,
      }).then((article) => res.status(201).send({ data: article }));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }

      return res.status(500).send({ message: "Internal server error" });
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  console.log("ArticleId", articleId);
  Article.findOne({ _id: articleId })
    .orFail()
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({ message: "Unauthorized to delete this article" });
      }

      return Article.deleteOne({ _id: articleId })
        .orFail()
        .then(() => {
          res.status(200).send({ data: article });
        });
    })
    .catch((err) => {
      console.error("Error deleting article", err);

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Article Parameter" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Article to delete Not Found ~ 404" });
      }

      res.status(500).send({ message: "Server error during article deletion" });
    });
};

const likeArticle = (req, res, next) => {
  const { itemId } = req.params;
  // const userId = req.user._id;

  console.log(req.body);
  //  First check what the req.body returns
  //  const {id, source, title, date, description, image, keywords} = req.body;
  Article.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() =>
      res.status(404).send({ message: "Not exisisting id in the db" })
    )
    .populate("owner")
    .then((updatedItem) => res.status(200).json(updatedItem))
    .catch((err) => {
      console.log("Check error", err);
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Not found in the db" });
      }

      return res
        .status(500)
        .send({ message: "Server Error while liking article" });
    });
};

const dislikeArticle = (req, res, next) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Bad Request: Invalid Format" });
  }

  return Article.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate("owner")
    .orFail()
    .then((updatedItem) => res.status(200).json(updatedItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Article to dislike not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Bad Request: Cast Error when disliking an item" });
      }
      return res
        .status(500)
        .send({ message: "500 Server Error when deleting an  Item" });
    });
};
module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle,
};
