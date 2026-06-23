import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navber from "@/components/Navber";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "baseboll-app-ver16",
  description: "enjoy your baseball",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
 
}>) {
  
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col relative -z-1">
       <Suspense>
       <Navber/>
       </Suspense>
      
        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  );
}