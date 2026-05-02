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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
          <footer className="border-t border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl mt-auto">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-sm text-zinc-500">
                  © 2025 B7systems. All rights reserved.
                </div>
                <nav className="flex items-center gap-5 text-sm text-zinc-400">
                  <a href="/about" className="transition-colors duration-200 hover:text-[#00ec97]">About</a>
                  <a href="/" className="transition-colors duration-200 hover:text-[#00ec97]">Agents</a>
                  <a href="/leaderboard" className="transition-colors duration-200 hover:text-[#00ec97]">Leaderboard</a>
                  <a href="/developers" className="transition-colors duration-200 hover:text-[#00ec97]">API</a>
                </nav>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <a href="https://github.com/Zhavkh/ORACLE" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-[#00ec97]">GitHub</a>
                  <a href="https://t.me/b7systems" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-[#00ec97]">Telegram</a>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-zinc-600">
                Built on NEAR Protocol
              </div>
            </div>
          </footer>
        </NearWalletProvider>
      </body>
    </html>
  );
}
