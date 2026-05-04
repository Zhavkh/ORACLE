"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { registerAgent, checkAgentName } from "@/lib/api";
import { useNearWallet } from "@/components/NearWalletProvider";

type NameCheckResult = {
  available: boolean;
  error: string | null;
  suggestions: string[];
};

const PROFANITY_LIST = [
  'fuck', 'shit', 'suck', 'wtf', 'suka', 'blad', 'blyat', 'cunt', 'ass',
  'dick', 'cock', 'pussy', 'bitch', 'bastard', 'idiot', 'stupid'
];

function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some(word => lower.includes(word));
}

export function RegisterForm() {
  const router = useRouter();
  const { walletId, connectWallet } = useNearWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"trading" | "chat" | "analytics" | "other">("other");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameCheck, setNameCheck] = useState<NameCheckResult | null>(null);
  const [checkingName, setCheckingName] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const descriptionLength = description.trim().length;
  const isDescriptionValid = descriptionLength >= 50;

  // Debounced name check
  const checkName = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setNameCheck(null);
      return;
    }
    setCheckingName(true);
    try {
      const result = await checkAgentName(value);
      setNameCheck(result);
    } catch (e) {
      setNameCheck(null);
    } finally {
      setCheckingName(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (name.trim()) {
        checkName(name.trim());
      } else {
        setNameCheck(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [name, checkName]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (nameCheck && !nameCheck.available) {
      setError(nameCheck.error || "Name is not available");
      return;
    }
    if (descriptionLength < 50) {
      setError("Description must be at least 50 characters");
      return;
    }
    if (!walletId) {
      setError("Please connect your NEAR wallet to register an agent");
      return;
    }
    if (containsProfanity(name) || containsProfanity(description)) {
      setError("Please use appropriate language");
      return;
    }
    setLoading(true);
    try {
      const res = await registerAgent({
        name: name.trim(),
        description: description.trim(),
        near_wallet_id: walletId,
        category,
        owner_email: email || undefined,
      });
      // Show success message for moderation
      setError(null);
      setLoading(false);
      alert("Your agent has been submitted for review. You will be notified within 1-24 hours.");
      // Reset form
      setName("");
      setDescription("");
      setCategory("other");
      setEmail(null);
      setNameCheck(null);
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
        <span className="text-xs uppercase tracking-wider text-zinc-400">Owner wallet</span>
        {walletId ? (
          <span className="text-xs text-[#00ec97]">{walletId}</span>
        ) : (
          <button type="button" onClick={connectWallet} className="text-xs text-[#00ec97]">
            Connect NEAR Wallet
          </button>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            required
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:bg-zinc-900/80 ${
              nameCheck?.available
                ? 'border-green-500/50 bg-green-900/10 focus:border-green-500'
                : nameCheck && !nameCheck.available
                ? 'border-red-500/50 bg-red-900/10 focus:border-red-500'
                : 'border-zinc-800 bg-zinc-900/50 focus:border-zinc-500'
            }`}
            placeholder="Agent name (lowercase, numbers, underscore)"
          />
          {checkingName && (
            <span className="absolute right-3 top-2.5 text-xs text-zinc-500">Checking...</span>
          )}
          {nameCheck?.available && !checkingName && (
            <span className="absolute right-3 top-2.5 text-green-400">✓</span>
          )}
          {nameCheck && !nameCheck.available && !checkingName && (
            <span className="absolute right-3 top-2.5 text-red-400">✗</span>
          )}
        </div>
        
        {nameCheck?.error && (
          <p className="text-xs text-red-400">{nameCheck.error}</p>
        )}
        
        {nameCheck && nameCheck.suggestions.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <p className="mb-2 text-xs text-zinc-400">Available alternatives:</p>
            <div className="flex flex-wrap gap-2">
              {nameCheck.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setName(suggestion);
                    checkName(suggestion);
                  }}
                  className="rounded-full bg-[#00ec97]/20 px-2 py-1 text-xs text-[#00ec97] hover:bg-[#00ec97]/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="category" className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as "trading" | "chat" | "analytics" | "other")}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 outline-none"
        >
          <option value="trading">Trading</option>
          <option value="chat">Chat</option>
          <option value="analytics">Analytics</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full resize-y rounded-lg border px-3 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/80 ${
            descriptionLength > 0 && !isDescriptionValid
              ? 'border-red-500/50 bg-red-900/10'
              : isDescriptionValid
              ? 'border-green-500/50 bg-green-900/10'
              : 'border-zinc-800 bg-zinc-900/50'
          }`}
          placeholder="What does this agent do? (minimum 50 characters)"
        />
        <div className={`text-xs ${isDescriptionValid ? 'text-green-400' : descriptionLength > 0 ? 'text-red-400' : 'text-zinc-500'}`}>
          {descriptionLength} / 50 characters minimum
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/80"
          placeholder="For approval notification"
        />
        <p className="text-xs text-zinc-500">
          We'll notify you when your agent is approved
        </p>
      </div>
      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {!walletId && (
        <p className="text-xs text-red-400">
          Please connect your NEAR wallet to register an agent
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !name.trim() || !isDescriptionValid || !walletId}
        className="w-full rounded-lg border border-[#00ec97]/70 bg-[#00ec97] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Creating…" : "Create agent"}
      </button>
    </form>
  );
}
