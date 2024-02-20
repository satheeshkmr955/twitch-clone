import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "email is required" },
        { status: 400 }
      );
    }

    let message = "";
    let isEmailExists = false;

    const user = await db.user.findUnique({ where: { email } });
    if (user !== null) {
      isEmailExists = true;
      message = "Email already exists";
    }

    return NextResponse.json({ message, isEmailExists }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while signup the email",
      },
      { status: 500 }
    );
  }
}
