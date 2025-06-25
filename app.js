require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { limiter } = require("./middlewares/express-limiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/newsexplorer_db")

  .then((data) => {
    console.log("Connected to the DB!", data);
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
//  Enabling the Request Logger

app.use(requestLogger);

app.use("/", indexRouter);
//  Enabling the error logger
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
