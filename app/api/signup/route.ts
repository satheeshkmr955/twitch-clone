import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { passwordValidation } from "@/constants/regex.constants";

const signUpSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z
    .string()
    .min(1, { message: "Please enter a email" })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Please enter a password" })
    .regex(passwordValidation, {
      message:
        "Please check password contains 1 uppercase, 1 lowercase, 1 number, 1 special character and minimum 8 characters",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await req.json();
    const result = signUpSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.formErrors.fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, name } = jsonBody;

    let message = {};
    let isEmailExists = false;

    const user = await db.user.findUnique({ where: { email } });
    if (user !== null) {
      isEmailExists = true;
      message = { email: "Email already exists" };
      return NextResponse.json({ message, isEmailExists }, { status: 200 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
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
