import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const hostname = process.env.HOSTNAME!;

declare global {
  var logger: undefined | winston.Logger;
}

const logger = globalThis.logger ?? createServerLogger();

function createServerLogger() {
  if (globalThis.logger) {
    return globalThis.logger;
  }

  const levels = [
    { fileName: "default", type: "info" },
    { fileName: "debug", type: "debug" },
    { fileName: "info", type: "info" },
    { fileName: "warn", type: "warn" },
    { fileName: "error", type: "error" },
  ];

  const { combine, timestamp, json } = winston.format;

  const transports = levels.map(({ fileName, type }) =>
    createServerTransport(
      `./logs/graphql-${fileName}-${hostname}-%DATE%.log`,
      type,
      fileName === "default"
        ? combine(timestamp(), json())
        : combine(createLevelFilter(type), timestamp(), json())
    )
  );

  const tempLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: combine(timestamp(), json()),
    transports: transports,
  });

  globalThis.logger = tempLogger;

  return tempLogger;
}

function createServerTransport(
  filenamePattern: string,
  level: string,
  format: winston.Logform.Format
) {
  return new DailyRotateFile({
    filename: filenamePattern,
    level: level,
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: format,
  });
}

// Helper function to create level-specific filters
function createLevelFilter(level: string) {
  return winston.format((info, opts) => {
    return info.level === level ? info : false;
  })();
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

export { logger };
