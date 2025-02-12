import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, json } = winston.format;

const hostname = process.env.HOSTNAME!;

declare global {
  var logger: undefined | winston.Logger;
}

const isServer = typeof window === "undefined";

const logger =
  globalThis.logger ?? (isServer ? createServerLogger() : createClientLogger());

function createServerLogger() {
  if (globalThis.logger) {
    return globalThis.logger;
  }

  const tempLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: combine(timestamp(), json()),
    transports: [
      // General transports
      createTransport(
        `./logs/graphql-default-${hostname}-%DATE%.log`,
        "info",
        combine(timestamp(), json())
      ),
      createTransport(
        `./logs/graphql-debug-${hostname}-%DATE%.log`,
        "debug",
        combine(createLevelFilter("debug"), timestamp(), json())
      ),
      createTransport(
        `./logs/graphql-info-${hostname}-%DATE%.log`,
        "info",
        combine(createLevelFilter("info"), timestamp(), json())
      ),
      createTransport(
        `./logs/graphql-warn-${hostname}-%DATE%.log`,
        "warn",
        combine(createLevelFilter("warn"), timestamp(), json())
      ),
      createTransport(
        `./logs/graphql-error-${hostname}-%DATE%.log`,
        "error",
        combine(createLevelFilter("error"), timestamp(), json())
      ),
    ],
  });

  globalThis.logger = tempLogger;

  return tempLogger;
}

// Function to create the logger with different log levels
function createClientLogger() {
  if (globalThis.logger) {
    return globalThis.logger;
  }

  const levels = ["debug", "info", "warn", "error"];

  const tempLogger = winston.createLogger({
    transports: levels.map((level) => createFluentdTransport(level)),
  });

  globalThis.logger = tempLogger;

  return tempLogger;
}

// Function to create a Fluentd transport with a specific log level
function createFluentdTransport(level: string) {
  return new winston.transports.Http({
    level: level, // The log level passed to the function
    format: winston.format.json(),
    host: "fluentd-server.local", // Fluentd server URL
    port: 24224, // default Fluentd port for HTTP input
    path: "/api/logs", // Adjust according to your Fluentd configuration
  });
}

function createTransport(
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
  }) as unknown as winston.Logform.Format;
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
