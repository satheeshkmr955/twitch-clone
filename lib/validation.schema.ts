import { z } from "zod";

import { checkEmailsExistsApiHandler } from "@/app/(root)/(auth)/_service/api";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter a email" })
    .email("This is not a valid email."),
  password: z.string().min(1, { message: "Please enter a password" }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "Please enter a email" })
      .email("This is not a valid email.")
      .refine(async (email) => {
        const isEmailExists = await checkEmailsExistsApiHandler({
          body: { email },
        });
        return !isEmailExists;
      }, "Email already exists"),
    password: z
      .string()
      .min(1, { message: "Please enter a password" })
      .regex(passwordValidation, {
        message:
          "Please check password contains 1 uppercase, 1 lowercase, 1 number, 1 special character and minimum 8 characters",
      }),
    confirm: z.string().min(1, { message: "Please retype your password" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const signUpApiSchema = z.object({
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

export const checkEmailsExistsSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter a email" })
    .email("This is not a valid email."),
});
