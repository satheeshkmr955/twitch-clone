import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import os from "os";
import { Plugin } from "graphql-yoga";
import { twMerge } from "tailwind-merge";
import { NextRequest } from "next/server";
import { getSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";

import { publicAxios } from "@/lib/fetcher";

import { GET } from "@/constants/message.constants";
import { GET_CLIENT_PUBLIC_IP } from "@/constants/api.constants";
import { logger } from "@/lib/logger";

import { ClientLog, Toast, ToastTypes, TriggerToastProps } from "@/app/_types";
import type pino from "pino";
import type { Session } from "next-auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function jsonParse(req: NextRequest) {
  let jsonBody: any = {};
  try {
    jsonBody = await req.json();
  } catch (error) {
    logger.error(error);
    jsonBody = {};
  }
  return jsonBody;
}

export function triggerToast(mayBeToast: TriggerToastProps) {
  if (mayBeToast !== undefined) {
    const toastObj = mayBeToast as Toast;
    const toastByType = toast[
      toastObj.type as ToastTypes
    ] as typeof toast.success;
    toastByType(toastObj.text);
  }
}

export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(1) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}

// Function to get the local IP address of the server
export const getServerIp = () => {
  const interfaces = os.networkInterfaces() || {};
  let serverIp = "127.0.0.1"; // Default to localhost

  for (let interfaceKey in interfaces) {
    const interfaceSubObj = interfaces[interfaceKey] || [];
    for (let interfaceInfo of interfaceSubObj) {
      if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
        serverIp = interfaceInfo.address;
        break;
      }
    }
  }

  return serverIp;
};

export function useSetResponseHeader(): Plugin {
  return {
    onResponse({ response }) {
      const serverIp = getServerIp();
      const date = new Date().toISOString();
      response.headers.set("X-Server-IP", serverIp);
      response.headers.set("X-Server-Date-Time", date);
    },
  };
}

export const getUserSession = async (): Promise<Session | null> => {
  const session = await getSession();
  return session;
};

export async function getClientPublicIP() {
  let ip = "-";
  try {
    const response: AxiosResponse = await publicAxios({
      url: GET_CLIENT_PUBLIC_IP,
      method: GET,
    });
    if (response.data.ip) {
      ip = response.data.ip;
    }
    return ip;
  } catch (error) {
    console.error(error);
    logger.error(error);
    return ip;
  }
}

export async function convertToApacheJsonLog(jsonData: pino.LogEvent) {
  const timestamp = new Date(jsonData.ts).toISOString();

  const session = await getUserSession();
  const clientip = await getClientPublicIP();

  let username = "-";
  let user_id = "-";
  if (session && session?.user) {
    username = session.user.slugName;
    user_id = session.user.id;
  }

  const apacheJsonLog: ClientLog = {
    clientip,
    username,
    user_id,
    timestamp,
    request_url: window.location.href,
    user_agent_raw: navigator.userAgent,
    message_data: jsonData.messages[0],
    log_level: jsonData.level.label,
    level_value: jsonData.level.value,
  };

  return apacheJsonLog;
}
