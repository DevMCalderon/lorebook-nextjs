import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookOpenText } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lorebook",
  description: "Manage your character, nation, and world-building entities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col py-5">
        <div className="mx-auto" aria-label="Home link">
          <Link href="/">
            <span className="flex items-center justify-center gap-2 text-4xl font-extrabold">
              <BookOpenText className="size-12" />
              Lorebook
            </span>
            <span>The app for world-building writers</span>
          </Link>
        </div>
        <main className="w-full max-w-3xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
