require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { limiter } = require("./middlewares/express-limiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3000, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)

  .then(() => {
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
//  Enabling the Request Logger

app.use(requestLogger);

app.use("/", indexRouter);
//  Enabling the error logger
app.use(errorLogger);

// Checking validation errors
app.use(errors());

// Centralized Error Hanlder
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
