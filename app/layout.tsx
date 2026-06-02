import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingOverlay from "@/src/Components/LoadingOverlay";
import RouteTransition from "@/src/Components/RouteTransition";
import Sidebar from '@/src/Components/Sidebar';
import ChatPanel from '@/src/Components/ChatPanel';
import ThemeToggle from '@/src/Components/ThemeToggle';

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
          <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1">
              <div className="flex items-center justify-end p-4">
                <ThemeToggle />
              </div>
              <RouteTransition>
                {children}
              </RouteTransition>
            </main>
            <ChatPanel />
          </div>
        </LoadingOverlay>
      </body>
    </html>
  );
}
