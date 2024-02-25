import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";

import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";

import { db } from "@/lib/db";
import { HOME, SIGN_IN } from "@/constants/route.constants";

export const authConfigOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          required: true,
        },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials!;

          const user = await db.user.findUnique({ where: { email } });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password || ""
          );

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Set to jwt, when Credentials provided is used, then only user will be authenticated
    strategy: "jwt",
  },
  pages: {
    signIn: SIGN_IN,
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: HOME, // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // debug: process.env.NODE_ENV !== "production",
  jwt: {
    maxAge: 60 * 60 * 24 * 1,
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
} satisfies NextAuthOptions;

export const getSession = async () => {
  return await getServerSession(authConfigOptions);
};
