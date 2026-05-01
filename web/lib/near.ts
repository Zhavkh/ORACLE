import { parseNearAmount } from "near-api-js";

export function isValidNearWalletId(value: string): boolean {
  const wallet = value.trim().toLowerCase();
  if (!wallet.endsWith(".near")) {
    return false;
  }
  if (wallet.length < 5 || wallet.length > 64) {
    return false;
  }
  return /^[a-z0-9._-]+\.near$/.test(wallet);
}

export function normalizeNearWalletId(value: string): string {
  return value.trim().toLowerCase();
}

export function formatNearHint(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const parsed = parseNearAmount(trimmed as `${number}`);
    return parsed ? `Example parsed yoctoNEAR: ${parsed.slice(0, 8)}...` : "";
  } catch {
    return "";
  }
}
