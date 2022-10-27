const winston = require("winston");

module.exports.logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "info.log",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});
