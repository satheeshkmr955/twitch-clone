import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const inter = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Twitch Clone with Real-Time Video, Chat, and User Interactions",
  description:
    "This project is a clone of the popular live-streaming platform, Twitch, built using a modern tech stack to deliver an immersive user experience. It features real-time video streaming, chat interactions, and user engagement through a seamless front-end and back-end integration.",
  keywords: [
    "Next.js",
    "Graphql Yoga",
    "Prisma (ORM)",
    "NextAuth",
    "TailwindCSS",
    "Shadcn/ui",
    "TypeScript",
    "Javascript",
    "PostgreSQL",
    "Redis",
    "AWS S3",
    "LiveKit",
    "Zustand",
    "Docker Compose",
    "Nginx",
    "TanStack Query",
    "Zod",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
