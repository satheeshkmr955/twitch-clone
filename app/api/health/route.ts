import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "ok" }, { status: HttpStatusCode.Ok });
}
