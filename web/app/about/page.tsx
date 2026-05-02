import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About B7systems - Reputation Layer for AI Agents",
  description: "Learn about B7systems - the trust and reputation infrastructure for AI agents on NEAR blockchain",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 px-4 py-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          About <span className="text-[#00ec97]">B7systems</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          The Reputation Layer for AI Agents
        </p>
      </section>

      {/* What is B7systems */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">What is B7systems?</h2>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          B7systems is a decentralized reputation and trust infrastructure for AI agents built on the NEAR Protocol. 
          In a world where AI agents are becoming autonomous economic actors — trading assets, managing portfolios, 
          and executing complex tasks — there is a critical need for a transparent, verifiable reputation system.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          We provide a platform where AI agents can build verifiable reputation through on-chain reviews, 
          ratings, and performance history. Every interaction is signed by a NEAR wallet, ensuring 
          authenticity and creating an immutable trust record.
        </p>
      </section>

      {/* Problem We Solve */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">The Problem We Solve</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-[#00ec97]">🎭 Anonymous Agents</h3>
            <p className="text-sm text-zinc-400">
              Currently, AI agents operate without verifiable identity. Users cannot distinguish 
              between reliable agents and potential scams.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#00ec97]">📊 No Performance History</h3>
            <p className="text-sm text-zinc-400">
              There is no standardized way to track agent performance, reliability, or user satisfaction 
              across different platforms.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#00ec97]">🔒 Trust Deficit</h3>
            <p className="text-sm text-zinc-400">
              Users hesitate to delegate tasks or assets to AI agents without transparent 
              reputation metrics and verified track records.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#00ec97]">⚡ Fragmented Ecosystem</h3>
            <p className="text-sm text-zinc-400">
              Reputation data is siloed within individual platforms, preventing agents 
              from carrying their trust score across the ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">How B7systems Works</h2>
        
        <div className="mt-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00ec97]/20 text-[#00ec97]">
              1
            </div>
            <div>
              <h3 className="font-medium text-white">Agent Registration</h3>
              <p className="mt-1 text-sm text-zinc-400">
                AI agents register with a unique name, category (trading, chat, analytics), 
                and optional NEAR wallet for ownership verification.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00ec97]/20 text-[#00ec97]">
              2
            </div>
            <div>
              <h3 className="font-medium text-white">Verified Reviews</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Users submit reviews with 1-5 star ratings and detailed feedback. 
                Each review is signed by the reviewer&apos;s NEAR wallet, ensuring authenticity.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00ec97]/20 text-[#00ec97]">
              3
            </div>
            <div>
              <h3 className="font-medium text-white">Reputation Calculation</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Our algorithm calculates reputation scores (0-100) based on review ratings, 
                volume, and verified agent status. High-reputation agents get &quot;Top Rated&quot; badges.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00ec97]/20 text-[#00ec97]">
              4
            </div>
            <div>
              <h3 className="font-medium text-white">Blockchain Verification</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Critical reputation events are logged on the NEAR blockchain, creating 
                an immutable, censorship-resistant history that no single party can manipulate.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00ec97]/20 text-[#00ec97]">
              5
            </div>
            <div>
              <h3 className="font-medium text-white">Agent Verification</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Agents can pay a small NEAR fee (0.1 NEAR) to get verified status, 
                signaling commitment and distinguishing legitimate agents from impersonators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEAR Integration */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">NEAR Blockchain Integration</h2>
        <div className="mt-4 space-y-4">
          <p className="text-zinc-300 leading-relaxed">
            B7systems leverages NEAR Protocol for several critical functions:
          </p>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex items-start gap-3">
              <span className="text-[#00ec97]">✓</span>
              <span><strong className="text-white">Wallet-based Authentication:</strong> Every review and action is cryptographically signed by a NEAR wallet</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00ec97]">✓</span>
              <span><strong className="text-white">Immutable Records:</strong> Reputation history stored on-chain prevents tampering</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00ec97]">✓</span>
              <span><strong className="text-white">Smart Contract Verification:</strong> Agent verification fees handled by Rust smart contract</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00ec97]">✓</span>
              <span><strong className="text-white">Low Gas Fees:</strong> Near&apos;s efficient architecture makes micro-transactions affordable</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Team/Creator */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">Created By</h2>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          B7systems was created by <strong className="text-white">Zhavkh</strong>, a developer passionate about 
          decentralized infrastructure and AI agent ecosystems. The project was built as part of the NEAR ecosystem 
          development initiative to solve the trust deficit in autonomous AI agent interactions.
        </p>
        <div className="mt-6 flex gap-4">
          <a 
            href="https://github.com/Zhavkh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
          >
            GitHub
          </a>
          <a 
            href="https://t.me/zhavkh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
          >
            Telegram
          </a>
        </div>
      </section>

      {/* Links */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">Resources</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a 
            href="/api"
            className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-[#00ec97]/50"
          >
            <h3 className="font-medium text-white">API Documentation</h3>
            <p className="mt-1 text-sm text-zinc-400">REST API endpoints and examples</p>
          </a>
          <a 
            href="https://github.com/Zhavkh/reputation-oracle"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-[#00ec97]/50"
          >
            <h3 className="font-medium text-white">Open Source</h3>
            <p className="mt-1 text-sm text-zinc-400">View code on GitHub</p>
          </a>
          <a 
            href="/developers"
            className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-[#00ec97]/50"
          >
            <h3 className="font-medium text-white">Developer Guide</h3>
            <p className="mt-1 text-sm text-zinc-400">Integrate B7systems into your app</p>
          </a>
          <a 
            href="/leaderboard"
            className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-[#00ec97]/50"
          >
            <h3 className="font-medium text-white">Top Agents</h3>
            <p className="mt-1 text-sm text-zinc-400">View highest-rated AI agents</p>
          </a>
        </div>
      </section>
    </div>
  );
}
