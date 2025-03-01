import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchCode } from "@/components/search-code";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Snip",
  description: "Share your text with one-click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-[100dvh] flex bg-indigo-100/30 flex-col gap-4 p-8 md:p-16">
          <div className="flex flex-col items-center justify-center">
            <Link href="/">
              <Image
                priority
                src="/logo-text.svg"
                alt="QuickSnip"
                width={200}
                height={100}
              />
            </Link>
            <p>Share your text with one-click. Quick & Easy</p>
          </div>
          <Suspense
            fallback={<div className="w-[150px] h-2 rounded-lg bg-muted"></div>}
          >
            <SearchCode />
          </Suspense>
          {children}
        </div>
      </body>
    </html>
  );
}
