"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { isValidNearWalletId, normalizeNearWalletId } from "@/lib/near";

type WalletContextValue = {
  walletId: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);
const STORAGE_KEY = "near_wallet_id";

export function NearWalletProvider({ children }: { children: React.ReactNode }) {
  const [walletId, setWalletId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(STORAGE_KEY);
  });

  const connectWallet = () => {
    const input = window.prompt("Enter your NEAR wallet (example: yourname.near)");
    if (!input) {
      return;
    }
    const normalized = normalizeNearWalletId(input);
    if (!isValidNearWalletId(normalized)) {
      window.alert("Invalid NEAR wallet. Use format like yourname.near");
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, normalized);
    setWalletId(normalized);
  };

  const disconnectWallet = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setWalletId(null);
  };

  const value = useMemo(
    () => ({ walletId, connectWallet, disconnectWallet }),
    [walletId]
  );
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useNearWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useNearWallet must be used within NearWalletProvider");
  }
  return ctx;
}
