import "./globals.css";
import { CommandBar } from "../components/command-bar";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ClientCanvas",
  description: "Canva-style design tool with approvals"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CommandBar />
        {children}
      </body>
    </html>
  );
}