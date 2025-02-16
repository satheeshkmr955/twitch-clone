import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export async function GET(req: NextRequest) {
  new URL(req.url);

  const headers = new Headers();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim();

  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  return NextResponse.json({ ip: ip }, { status: HttpStatusCode.Ok, headers });
}
