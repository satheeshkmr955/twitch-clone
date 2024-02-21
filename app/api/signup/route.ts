import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { signUpApiSchema } from "@/lib/validation.schema";
import { jsonParse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await jsonParse(req);
    const result = signUpApiSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.formErrors.fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, name } = jsonBody;

    const user = await db.user.findUnique({ where: { email } });
    if (user !== null) {
      return NextResponse.json(
        { errors: { email: ["Email already exists"] } },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json(
      {
        toast: {
          text: "User registered.",
          type: "success",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        toast: {
          text: "An error occurred while signup the email",
          type: "error",
        },
      },
      { status: 500 }
    );
  }
}
