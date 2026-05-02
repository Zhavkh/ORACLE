"use client";

import Link from "next/link";
import { useNearWallet } from "@/components/NearWalletProvider";

export function Header() {
  const { walletId, connectWallet, disconnectWallet } = useNearWallet();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[#00ec97] transition-opacity duration-200 hover:opacity-80"
        >
          B7systems
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-400">
          <Link
            href="/"
            className="hidden transition-colors duration-200 hover:text-[#00ec97] sm:block"
          >
            Agents
          </Link>
          <Link
            href="/about"
            className="hidden transition-colors duration-200 hover:text-[#00ec97] sm:block"
          >
            About
          </Link>
          <Link
            href="/leaderboard"
            className="transition-colors duration-200 hover:text-[#00ec97]"
          >
            Leaderboard
          </Link>
          <Link
            href="/developers"
            className="hidden transition-colors duration-200 hover:text-[#00ec97] sm:block"
          >
            API
          </Link>
          <Link
            href="/register"
            className="transition-colors duration-200 hover:text-[#00ec97]"
          >
            Register
          </Link>
          {walletId ? (
            <button
              type="button"
              onClick={disconnectWallet}
              className="rounded-full border border-[#00ec97]/50 px-3 py-1 text-xs text-[#00ec97] transition hover:border-[#00ec97] hover:bg-[#00ec97]/10"
              title={walletId}
            >
              {walletId}
            </button>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200 transition hover:border-[#00ec97] hover:text-[#00ec97]"
            >
              Connect NEAR Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
