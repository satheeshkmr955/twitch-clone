"use client";

import { SessionProvider } from "next-auth/react";

import type { Session } from "next-auth";

type AuthProviderProps = {
  session: Session | null;
  children: React.ReactNode;
};

export const AuthProvider = (props: AuthProviderProps) => {
  const { session, children } = props;

  return <SessionProvider session={session}>{children}</SessionProvider>;
};
