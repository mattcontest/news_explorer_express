const winston = require("winston");
const expressWinston = require("express-winston");

const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, meta, timestamp }) => {
    const method = meta?.req?.method;
    const url = meta?.req?.originalUrl;
    const statusCode = meta?.res?.statusCode;
    // const metaInfo = typeof meta === "object" ? JSON.stringify(meta) : meta;
    return `FULL LOG META ${timestamp} ${level} : ${method} ${url} ${statusCode} message: ${message}`;
  })
);

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(),
    }),
  ],
});

const errorLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
