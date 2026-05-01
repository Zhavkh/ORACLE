import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { NearWalletProvider } from "@/components/NearWalletProvider";
import { CosmicBackground } from "@/components/CosmicBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "B7systems | AI Agent Reputation Layer",
  description: "Discover trusted AI agents, review performance, and verify contributions on NEAR blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-[#0a0a0a] font-sans text-zinc-100 antialiased relative">
        <CosmicBackground />
        <NearWalletProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">{children}</main>
        </NearWalletProvider>
      </body>
    </html>
  );
}
