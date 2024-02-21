import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { checkEmailsExistsSchema } from "@/lib/validation.schema";
import { jsonParse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await jsonParse(req);
    const result = checkEmailsExistsSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.formErrors.fieldErrors },
        { status: 400 }
      );
    }
    const { email } = jsonBody;

    let isEmailExists = false;

    const user = await db.user.findUnique({ where: { email } });
    if (user !== null) {
      isEmailExists = true;
    }

    return NextResponse.json(
      {
        isEmailExists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        toast: {
          text: "An error occurred while checking the email",
          type: "error",
        },
      },
      { status: 500 }
    );
  }
}
