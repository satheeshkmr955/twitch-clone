"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { EyeOffIcon, EyeIcon } from "lucide-react";

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
import { HOME, SIGN_IN } from "@/constants/route.constants";
import { signUpSchema } from "@/lib/validation.schema";
import { logger } from "@/lib/logger";
import { SignUpApiProps, signUpApiHandler } from "../_service/api";
import { Error } from "@/app/_types";

type SignUpSchemaType = z.infer<typeof signUpSchema>;
type SignUpKeys = keyof Omit<SignUpSchemaType, "confirm">;

const SignUp = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPasswordShow, setPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const EyeIconClassName =
    "w-[20px] absolute top-[10px] right-[10px] text-gray-400 cursor-pointer hover:text-gray-600";

    useEffect(() => {
      if (status !== "loading") {
        if (session !== null) {
          redirect(HOME);
        }
      }
    }, [session, status]);

  // 1. Define your form.
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onClickTogglePasswordHandler = () => {
    setPasswordShow((prevState) => !prevState);
  };

  const onClickToggleConfirmPasswordHandler = () => {
    setConfirmPasswordShow((prevState) => !prevState);
  };

  // 2. Define a submit handler.
  const onSubmit = async (values: SignUpSchemaType) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { confirm, ...body } = values;

    const config: SignUpApiProps = {
      body,
      onSuccess() {
        const searchParams = new URLSearchParams();
        searchParams.append("email", values.email);
        const qs = "?" + searchParams.toString();
        router.push(SIGN_IN + qs);
      },
      onError(error, statusCode) {
        if (statusCode === HttpStatusCode.BadRequest) {
          const err = error as Error;
          const fields = Object.keys(err.errors!) as SignUpKeys[];
          fields.forEach((key) => {
            form.setError(
              key,
              {
                message: err.errors![key]![0],
              },
              { shouldFocus: true }
            );
          });
        }
        logger.error(error);
      },
    };

    await signUpApiHandler(config);
  };

  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: HOME });
  };

  return (
    <div className="w-[95%] md:m-6 md:w-4/6 lg:w-1/4">
      <Card className="shadow-gray-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant={"outline"}
            className="w-full justify-start"
            onClick={onGoogleSignIn}
          >
            <span className="pr-2">
              <Image
                src={"/images/google.svg"}
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
                      <FormControl className="relative">
                        <div>
                          <Input
                            placeholder="Your password"
                            {...field}
                            type={isPasswordShow ? "text" : "password"}
                          />
                          {isPasswordShow ? (
                            <EyeOffIcon
                              className={EyeIconClassName}
                              onClick={onClickTogglePasswordHandler}
                            />
                          ) : (
                            <EyeIcon
                              className={EyeIconClassName}
                              onClick={onClickTogglePasswordHandler}
                            />
                          )}
                        </div>
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
                      <FormControl className="relative">
                        <div>
                          <Input
                            placeholder="Renter your password"
                            {...field}
                            type={isConfirmPasswordShow ? "text" : "password"}
                          />
                          {isConfirmPasswordShow ? (
                            <EyeOffIcon
                              className={EyeIconClassName}
                              onClick={onClickToggleConfirmPasswordHandler}
                            />
                          ) : (
                            <EyeIcon
                              className={EyeIconClassName}
                              onClick={onClickToggleConfirmPasswordHandler}
                            />
                          )}
                        </div>
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
            <Button variant={"link"} className="text-purple-600 pl-2" asChild>
              <Link href={SIGN_IN}>Sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
