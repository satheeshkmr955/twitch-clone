import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { HttpStatusCode } from "axios";
import slugify from "slugify";

import { db } from "@/lib/db";
import { signUpApiSchema } from "@/lib/validation.schema";
import { jsonParse } from "@/lib/utils";
import { logger } from '@/lib/serverLogger';
import {
  DEFAULT_API_ERROR,
  EMAIL_EXISTS,
  ERROR,
  SUCCESS,
  USER_CREATED,
  WARNING,
} from "@/constants/message.constants";
import { SLUGIFY_OPTIONS } from "@/constants/common.constants";

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
        {
          errors: { email: [EMAIL_EXISTS] },
          toast: {
            text: EMAIL_EXISTS,
            type: WARNING,
          },
        },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const slugName = slugify(name, SLUGIFY_OPTIONS);

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        slugName,
        stream: {
          create: {
            name: `${slugName}'s stream`,
          },
        },
      },
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
