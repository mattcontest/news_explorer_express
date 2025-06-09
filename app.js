const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { limiter } = require("./middlewares/express-limiter");

const app = express();
const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/newsexplorer_db")

  .then((data) => {
    console.log("Connected to the DB!");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(limiter);

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
