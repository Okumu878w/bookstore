// Pricing for Rising Without Losing Yourself.
//
// This is the AUTHORITATIVE copy — create-order uses this to compute the
// amount actually charged, ignoring any price the client sends. If you
// change the amount here, mirror the change in src/lib/pricing.ts
// (frontend display copy) too, identically.

export type PriceTier = 'standard'

const PRICES: Record<PriceTier, number> = {
  standard: 1000,
}

export function getCurrentTier(_now: Date = new Date()): PriceTier {
  return 'standard'
}

export function getCurrentPrice(now: Date = new Date()): number {
  return PRICES[getCurrentTier(now)]
}