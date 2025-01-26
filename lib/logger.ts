import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, json } = winston.format;

const hostname = process.env.HOSTNAME!;

const debugFilter = winston.format((info, opts) => {
  return info.level === "debug" ? info : false;
});

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const warnFilter = winston.format((info, opts) => {
  return info.level === "warn" ? info : false;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(timestamp(), json()),
  transports: [
    new DailyRotateFile({
      filename: "./logs/default-" + hostname + "-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "./logs/debug-" + hostname + "-%DATE%.log",
      level: "debug",
      format: combine(debugFilter(), timestamp(), json()),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "./logs/info-" + hostname + "-%DATE%.log",
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "./logs/warn-" + hostname + "-%DATE%.log",
      level: "warn",
      format: combine(warnFilter(), timestamp(), json()),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "./logs/error-" + hostname + "-%DATE%.log",
      level: "error",
      format: combine(errorFilter(), timestamp(), json()),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  // logger.add(
  //   new winston.transports.Console({
  //     format: winston.format.simple(),
  //   })
  // );
}
