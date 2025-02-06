import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, json } = winston.format;

const hostname = process.env.HOSTNAME!;

declare global {
  var logger: undefined | winston.Logger;
}

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

const isServer = typeof window === "undefined";

const logger = globalThis.logger ?? (isServer ? createLogger() : null);

function createLogger() {
  if (globalThis.logger) {
    return globalThis.logger;
  }

  const tempLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: combine(timestamp(), json()),
    transports: [
      new DailyRotateFile({
        filename: "./logs/graphql-default-" + hostname + "-%DATE%.log",
        datePattern: "YYYY-MM-DD-HH",
        level: "info",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        filename: "./logs/graphql-debug-" + hostname + "-%DATE%.log",
        level: "debug",
        format: combine(debugFilter(), timestamp(), json()),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        filename: "./logs/graphql-info-" + hostname + "-%DATE%.log",
        level: "info",
        format: combine(infoFilter(), timestamp(), json()),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        filename: "./logs/graphql-warn-" + hostname + "-%DATE%.log",
        level: "warn",
        format: combine(warnFilter(), timestamp(), json()),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        filename: "./logs/graphql-error-" + hostname + "-%DATE%.log",
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
    // tempLogger.add(
    //   new winston.transports.Console({
    //     format: winston.format.simple(),
    //   })
    // );
  }

  globalThis.logger = tempLogger;

  return tempLogger;
}

let startTime;
let duration;
let logObj;
export function writeLogs(eventName: any, args: any) {
  const query = args?.args?.contextValue?.params?.query || "";
  const variables = args?.args?.contextValue?.params?.variables || "";

  switch (eventName) {
    case "execute-start":
      startTime = Date.now();
      break;

    case "execute-end":
      duration = Date.now() - startTime!;
      logObj = {
        query,
        variables,
        duration_ms: duration,
      };
      logger && logger.info(JSON.stringify(logObj));
      break;

    case "subscribe-start":
      startTime = Date.now();
      break;

    case "subscribe-end":
      duration = Date.now() - startTime!;
      logObj = {
        query,
        variables,
        duration_ms: duration,
      };
      logger && logger.info(JSON.stringify(logObj));
      break;

    default:
      break;
  }
}

export { logger, createLogger };
