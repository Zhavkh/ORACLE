"use client";

import { useState } from "react";
import { generateApiKey, fetchMyApiKeys, type ApiKey } from "@/lib/api";
import { useNearWallet } from "@/components/NearWalletProvider";

export default function DevelopersPage() {
  const { walletId, connectWallet } = useNearWallet();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [myKeys, setMyKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!walletId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateApiKey(walletId);
      setApiKey(result.key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate API key");
    } finally {
      setLoading(false);
    }
  }

  async function handleShowMyKeys() {
    if (!walletId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyApiKeys(walletId);
      setMyKeys(result.keys);
      setShowKeys(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="fade-in rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#00ec97]">API ACCESS</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Developers
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Generate API keys to integrate reputation data into your applications.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="fade-in rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-medium text-zinc-100">Generate API Key</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Create a new API key linked to your NEAR wallet.
          </p>

          <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4">
            <span className="text-xs uppercase tracking-wider text-zinc-400">Connected Wallet</span>
            <div className="mt-1">
              {walletId ? (
                <span className="text-sm text-[#00ec97]">{walletId}</span>
              ) : (
                <button
                  onClick={connectWallet}
                  className="text-sm text-[#00ec97] hover:underline"
                >
                  Connect NEAR Wallet
                </button>
              )}
            </div>
          </div>

          {apiKey && (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs text-green-400">Your new API Key (save it now!):</p>
              <code className="mt-2 block break-all rounded bg-black/50 p-2 text-xs text-zinc-300">
                {apiKey}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(apiKey)}
                className="mt-2 text-xs text-green-400 hover:underline"
              >
                Copy to clipboard
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={!walletId || loading}
            className="mt-4 w-full rounded-lg border border-[#00ec97]/70 bg-[#00ec97] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Generating..." : "Generate API Key"}
          </button>

          {walletId && (
            <button
              onClick={handleShowMyKeys}
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-zinc-500 disabled:opacity-40"
            >
              Show My API Keys
            </button>
          )}

          {showKeys && myKeys.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-zinc-400">Your API Keys:</p>
              {myKeys.map((key) => (
                <div key={key.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <code className="text-xs text-zinc-400">{key.key}</code>
                  <p className="mt-1 text-xs text-zinc-600">
                    Created: {key.created_at ? new Date(key.created_at).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="fade-in rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-medium text-zinc-100">API Documentation</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Use your API key to access reputation data programmatically.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Base URL</p>
              <code className="mt-1 block rounded bg-black/50 p-2 text-xs text-zinc-300">
                https://reputation-oracle-api.vercel.app
              </code>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Authentication</p>
              <p className="mt-1 text-sm text-zinc-400">
                Include your API key in the header:
              </p>
              <code className="mt-1 block rounded bg-black/50 p-2 text-xs text-zinc-300">
                X-API-Key: your_api_key_here
              </code>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Endpoints</p>
              <ul className="mt-2 space-y-2 text-sm text-zinc-400">
                <li>
                  <code className="rounded bg-black/50 px-1 text-zinc-300">GET /agents</code>
                  <span className="ml-2">List all agents</span>
                </li>
                <li>
                  <code className="rounded bg-black/50 px-1 text-zinc-300">GET /agents/{"{id}"}</code>
                  <span className="ml-2">Get agent details</span>
                </li>
                <li>
                  <code className="rounded bg-black/50 px-1 text-zinc-300">GET /stats</code>
                  <span className="ml-2">Public statistics</span>
                </li>
                <li>
                  <code className="rounded bg-black/50 px-1 text-zinc-300">GET /leaderboard</code>
                  <span className="ml-2">Top agents</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
