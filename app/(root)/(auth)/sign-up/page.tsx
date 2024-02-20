"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SIGN_IN } from "@/constants/route.constants";
import { CHECK_EMAIL_EXISTS } from "@/constants/api.constants";
import { passwordValidation } from "@/constants/regex.constants";
import { publicAxios } from "@/lib/fetcher";

type checkEmailsExistsProps = {
  isEmailExists: boolean;
  message: string;
};

const checkEmailsExistsApi = async ({ email }: { email: string }) => {
  try {
    const response: AxiosResponse = await publicAxios({
      data: { email },
      url: CHECK_EMAIL_EXISTS,
      method: "POST",
    });
    const data: checkEmailsExistsProps = response.data;
    return data.isEmailExists;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const signUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "Please enter a email" })
      .email("This is not a valid email.")
      .refine(async (email) => {
        const isEmailExists = await checkEmailsExistsApi({ email });
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

const SignUp = () => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  const signInHandler = () => {
    router.push(SIGN_IN);
  };

  return (
    <div className="m-6 w-1/4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"outline"} className="w-full justify-start">
            <span className="pr-2">
              <Image
                src={"/google.svg"}
                width={20}
                height={20}
                alt="google"
              ></Image>
            </span>
            <span className="w-full flex justify-center">
              Continue with Google
            </span>
          </Button>
          <div className="flex items-center my-5">
            <Separator className="w-2/5" />
            <span className="w-1/5 flex justify-center text-gray-400">or</span>
            <Separator className="w-2/5" />
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-default flex items-center">
                        Name
                        <span className="pl-1 text-red-600 text-[18px]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-default flex items-center">
                        Email
                        <span className="pl-1 text-red-600 text-[18px]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-default flex items-center">
                        Password
                        <span className="pl-1 text-red-600 text-[18px]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-default flex items-center">
                        Confirm password
                        <span className="pl-1 text-red-600 text-[18px]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Renter your password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full uppercase bg-purple-600 text-white text-xs font-semibold hover:bg-purple-800"
                >
                  continue
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Have an account?</span>
            <Button
              variant={"link"}
              className="text-purple-600 pl-2"
              onClick={signInHandler}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
