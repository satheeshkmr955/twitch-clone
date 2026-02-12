import type winston from "winston";
import pino from "pino";
import axios from "axios";

import { convertToApacheJsonLog } from "@/lib/utils";
import { ClientLog } from "@/app/_types";

const FLUENTD_URL = process.env.NEXT_PUBLIC_FLUENTD_ENDPOINT!;

declare global {
  var logger: undefined | winston.Logger;
}

// const logger = globalThis.logger ?? createClientLogger();
const logger = { error: (e: any) => {} };

const logToFluentd = async (level: string, logEvent: ClientLog) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const config = {
      headers,
    };
    await axios.post(FLUENTD_URL + `/fluent.${level}`, logEvent, config);
  } catch (error) {
    console.error("Error sending log to Fluentd:", error);
  }
};

// Function to create the logger with different log levels
function createClientLogger() {
  if (globalThis.logger) {
    return globalThis.logger;
  }

  const tempLogger = pino({
    browser: {
      transmit: {
        level: "info",
        async send(level, logEvent) {
          const clientLogs = await convertToApacheJsonLog(logEvent);
          logToFluentd(level, clientLogs);
        },
      },
    },
  }) as unknown as winston.Logger;

  globalThis.logger = tempLogger;

  return tempLogger;
}

export { logger };
