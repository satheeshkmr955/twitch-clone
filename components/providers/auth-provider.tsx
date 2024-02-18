"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

import type { Session } from "next-auth";

import { SIGN_IN, SIGN_UP } from "@/constants/route.constants";

type AuthProviderProps = {
  session: Session | null;
  children: React.ReactNode;
};

export const AuthProvider = (props: AuthProviderProps) => {
  const { session, children } = props;

  const pathName = usePathname();

  useEffect(() => {
    if (session === null && pathName !== SIGN_IN && pathName !== SIGN_UP) {
      redirect(SIGN_IN);
    }
  }, [session, pathName]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
};
