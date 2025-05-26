const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //~15 Mins
  limit: 100, //Limit each ip to 100 request per window
  standardHeaders: "draft-h",
  legacyHeaders: false,
});

module.exports = { limiter };
