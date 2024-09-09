"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { metadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavBar =
    pathname === "/auth/login" || pathname === "/auth/register";

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {!hideNavBar && <NavBar />}
          <main className="container mx-auto p-4">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
