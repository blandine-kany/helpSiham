require("winston-daily-rotate-file");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;

// Custom format for logging
const myFormat = printf(
  ({ level, message, filePath, timestamp, data, error }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}] ${filePath}:`;

    if (message.trim()) {
      logMessage = logMessage + ` ${message}`;
    }

    if (data) {
      logMessage =
        logMessage + `\n------[DATA]------\n${data}\n------------------`;
    }

    // Display errors
    if (error) {
      if (error.stack) {
        logMessage =
          logMessage +
          `\n------[ERROR]------\n${error.stack}\n-------------------`;
      } else {
        logMessage =
          logMessage + `\n------[ERROR]------\n${error}\n-------------------`;
      }
    }
    return logMessage;
  }
);

//Log file configuration
const rotateFileTransport = (filename, level) =>
  new transports.DailyRotateFile({
    level: level,
    filename: `logs/%DATE%-${filename}.log`,
    maxSize: "1g",
    maxDays: "3d",
    zippedArchive: true,
    datePattern: "YYYY-MM-DD",
  });

const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    rotateFileTransport("error", "error"),
    rotateFileTransport("helpSiham"),
  ],
});
module.exports = logger;
