import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

import { db } from "@/lib/db";
import { checkEmailsExistsSchema } from "@/lib/validation.schema";
import { jsonParse } from "@/lib/utils";
import { logger } from "@/lib/serverLogger";
import { DEFAULT_API_ERROR, ERROR } from "@/constants/message.constants";

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await jsonParse(req);
    const result = checkEmailsExistsSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.formErrors.fieldErrors },
        { status: HttpStatusCode.BadRequest }
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
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    logger.error(error);
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
