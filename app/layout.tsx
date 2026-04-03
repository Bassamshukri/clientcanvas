import "./globals.css";
import { CommandBar } from "../components/command-bar";
import { ToastProvider } from "../components/strategic-toast";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ClientCanvas | Strategic Operating System",
  description: "High-fidelity strategic coordination and presentation protocol."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
           <CommandBar />
           {children}
        </ToastProvider>
      </body>
    </html>
  );
}