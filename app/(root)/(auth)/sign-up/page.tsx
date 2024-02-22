"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";

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
import { signUpSchema } from "@/lib/validation.schema";
import { SignUpApiProps, signUpApiHandler } from "../_service/api";
import { SignupError, SignupSuccess } from "@/app/_types";

type SignUpSchemaType = z.infer<typeof signUpSchema>;
type SignUpKeys = keyof Omit<SignUpSchemaType, "confirm">;

const SignUp = () => {
  const router = useRouter();

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

  // 2. Define a submit handler.
  const onSubmit = async (values: SignUpSchemaType) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { confirm, ...body } = values;

    const config: SignUpApiProps = {
      body,
      onSuccess(data) {
        toast.success(data.toast.text);
      },
      onError(error, statusCode) {
        if (statusCode === HttpStatusCode.InternalServerError) {
          const err = error as SignupSuccess;
          toast.error(err.toast.text);
        }
        if (statusCode === HttpStatusCode.BadRequest) {
          const err = error as SignupError;
          const fields = Object.keys(err.errors) as SignUpKeys[];
          fields.forEach((key) => {
            form.setError(
              key,
              {
                message: err.errors[key]![0],
              },
              { shouldFocus: true }
            );
          });
        }
      },
    };

    await signUpApiHandler(config);
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
