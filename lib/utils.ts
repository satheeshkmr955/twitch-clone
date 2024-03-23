import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
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
