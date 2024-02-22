import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { HttpStatusCode } from "axios";

import { db } from "@/lib/db";
import { signUpApiSchema } from "@/lib/validation.schema";
import { jsonParse } from "@/lib/utils";
import {
  DEFAULT_API_ERROR,
  EMAIL_EXISTS,
  ERROR,
  SUCCESS,
  USER_CREATED,
} from "@/constants/message.constants";

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await jsonParse(req);
    const result = signUpApiSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.formErrors.fieldErrors },
        { status: HttpStatusCode.BadRequest }
      );
    }
    const { email, password, name } = jsonBody;

    const user = await db.user.findUnique({ where: { email } });
    if (user !== null) {
      return NextResponse.json(
        { errors: { email: [EMAIL_EXISTS] } },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json(
      {
        toast: {
          text: USER_CREATED,
          type: SUCCESS,
        },
      },
      { status: HttpStatusCode.Created }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        toast: {
          text: DEFAULT_API_ERROR,
          type: ERROR,
        },
      },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
