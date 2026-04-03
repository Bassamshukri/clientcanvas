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
  const isConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
           {!isConfigured && (
             <div style={{ 
               background: "var(--primary)", 
               color: "white", 
               padding: "12px", 
               textAlign: "center", 
               fontSize: "12px", 
               fontWeight: "800",
               letterSpacing: "1px",
               position: "fixed",
               top: 0, left: 0, right: 0,
               zIndex: 99999
             }}>
               INFRASTRUCTURE_UNSTABLE // MISSING_ENVIRONMENT_VARIABLES // CHECK_VERCEL_DASHBOARD
             </div>
           )}
           <CommandBar />
           {children}
        </ToastProvider>
      </body>
    </html>
  );
}