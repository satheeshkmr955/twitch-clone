"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
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
import { HOME, SIGN_UP } from "@/constants/route.constants";
import { signInSchema } from "@/lib/validation.schema";

type SignInSchemaType = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isPasswordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (status !== "loading") {
      if (session !== null) {
        redirect(HOME);
      }
    }
  }, [session, status]);

  const EyeIconClassName =
    "w-[20px] absolute top-[10px] right-[10px] text-gray-400 cursor-pointer hover:text-gray-600";

  const onClickTogglePasswordHandler = () => {
    setPasswordShow((prevState) => !prevState);
  };

  // 1. Define your form.
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: email ? email : "",
      password: "",
    },
  });

  useEffect(() => {
    if (email) {
      form.setFocus("password");
    }
  }, [email, form]);

  // 2. Define a submit handler.
  const onSubmit = (values: SignInSchemaType) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    signIn("credentials", { ...values, callbackUrl: HOME });
  };

  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: HOME });
  };

  return (
    <div className="w-[95%] md:m-6 md:w-4/6 lg:w-1/4">
      <Card className="shadow-gray-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
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
            <span className="text-sm text-gray-500">No account?</span>
            <Button variant={"link"} className="text-purple-600 pl-2" asChild>
              <Link href={SIGN_UP}>Sign up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
