require("winston-daily-rotate-file");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

// Custom format for logging
const myFormat = printf(
  ({ level, message, filePath, timestamp, data, error }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}] ${filePath}: ${message}`;
    if (data) {
      logMessage = logMessage + `\n${data}`;
    }
    if (error) {
      logMessage = logMessage + `\n------------\n${error}\n------------\n`;
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
