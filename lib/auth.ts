import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import slugify from "slugify";

import type { DefaultSession, NextAuthConfig } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { PrismaClient } from "@prisma/client";

import { db } from "@/lib/db";
import { logger } from "@/lib/clientLogger";
import { HOME, SIGN_IN } from "@/constants/route.constants";
import { encode } from "next-auth/jwt";
import { SLUGIFY_OPTIONS } from "@/constants/common.constants";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user?: DefaultSession["user"] & { slugName: string; id: string };
  }

  interface User {
    slugName?: string | null;
    id: string;
  }

  interface DefaultUser {
    slugName?: string | null;
    id: string;
  }
}

function CustomAdapter(p: PrismaClient) {
  return {
    ...PrismaAdapter(p),
  };
}

export const authConfigOptions = {
  adapter: CustomAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          slugName: slugify(profile.name, SLUGIFY_OPTIONS),
        };
      },
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
          const email = credentials?.email as string;
          const password = credentials?.password as string;

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
          logger.error(error);
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
    async jwt({ token, trigger, user }) {
      if (trigger === "signUp") {
        const dbUser = await db.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          await db.stream.create({
            data: {
              name: `${dbUser.slugName!}'s stream`,
              userId: dbUser.id!,
            },
          });
        }
      }
      if (user) {
        token.slugName = user?.slugName || "";
        token.id = user?.id || "";
      }
      return token;
    },
    async session({ session, token }) {
      const jwt = await encode({
        token,
        secret: process.env.NEXTAUTH_SECRET!,
        salt: process.env.AUTH_SECRET!,
      });
      session.accessToken = jwt;
      if (session?.user) {
        session.user.slugName = "";
        if (token?.slugName) {
          session.user.slugName = token.slugName as string;
        }
        if (token?.id) {
          session.user.id = token.id as string;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfigOptions);

export const getSession = async () => {
  return await auth();
};
