import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingOverlay from "@/src/Components/LoadingOverlay";
import RouteTransition from "@/src/Components/RouteTransition";
import Sidebar from "@/src/Components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentic",
  description: "A minimalist social space built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <LoadingOverlay>
          <Sidebar />
          <RouteTransition>
            {children}
          </RouteTransition>
        </LoadingOverlay>
      </body>
    </html>
  );
}
