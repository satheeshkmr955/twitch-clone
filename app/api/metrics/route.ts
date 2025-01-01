import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

import { prometheusRegistry } from "@/lib/prometheus";

export async function GET(req: NextRequest) {
  new URL(req.url);

  const headers = new Headers();

  headers.set("Content-Type", prometheusRegistry.contentType);
  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  const metrics_text = await prometheusRegistry.metrics();

  return new NextResponse(metrics_text, {
    status: HttpStatusCode.Ok,
    statusText: "ok",
    headers,
  });
}
