import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import os from "os";
import { Plugin } from "graphql-yoga";
import { twMerge } from "tailwind-merge";
import { NextRequest } from "next/server";

import { Toast, ToastTypes, TriggerToastProps } from "@/app/_types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function jsonParse(req: NextRequest) {
  let jsonBody: any = {};
  try {
    jsonBody = await req.json();
  } catch (error) {
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
