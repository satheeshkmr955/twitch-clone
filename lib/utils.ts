import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextRequest } from "next/server";

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
