import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwipeHire",
  description: "Discover jobs with a Tinder-like experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f7fafc] text-slate-900`}>
        <div className="min-h-screen md:flex">
          {/* Sidebar (desktop) + mobile top bar handled inside Sidebar component */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 md:pl-64">
            <main className="min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
