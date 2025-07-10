const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorizedError");

module.exports = (req, res, next) => {
  console.log("🛡️ AUTH MIDDLEWARE TRIGGERED");

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    // return res.status(401).send({ message: "Authorization required!" });
    return next(new UnauthorizedError("Authorization required!"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  // console.log("Check paylaod", payload)

  console.log("PAYLOAD", token, JWT_SECRET);
  try {
    console.log("PAYLOAD", token, JWT_SECRET);
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // return res.status(401).send({
    //   message: "Authorization required ~ Didn't pass jwt verification",
    // });
    return next(
      new UnauthorizedError(
        "Authorization required ~ Didn't pass jwt verification"
      )
    );
  }

  req.user = payload;
  return next();
};
