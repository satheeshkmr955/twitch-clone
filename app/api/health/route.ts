import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export async function GET(req: NextRequest) {
  new URL(req.url);

  const headers = new Headers();

  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  return NextResponse.json(
    { status: "OK" },
    { status: HttpStatusCode.Ok, headers }
  );
}
