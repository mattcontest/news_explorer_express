const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

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

app.use(express.json());

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
