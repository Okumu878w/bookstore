// Pricing tiers for Rising Without Losing Yourself.
//
// This is the AUTHORITATIVE copy — create-order uses this to compute the
// amount actually charged, ignoring any price the client sends. If you
// change the dates or amounts here, mirror the change in
// src/lib/pricing.ts (frontend display copy) too, identically.

export type PriceTier = 'early-bird' | 'standard'
// If the Preorder tier ever comes back, add it here too:
// export type PriceTier = 'early-bird' | 'preorder' | 'standard'

const EARLY_BIRD_ENDS = '2026-09-15T23:59:59+03:00' // end of day, Africa/Nairobi

// --- Preorder tier — removed by the client (kept here for reference) ---
// const PREORDER_ENDS = '2026-09-20T23:59:59+03:00' // end of day, Africa/Nairobi
// -------------------------------------------------------------------------

const PRICES: Record<PriceTier, number> = {
  'early-bird': 800,
  standard: 1000,
  // preorder: 900,
}

export function getCurrentTier(now: Date = new Date()): PriceTier {
  if (now <= new Date(EARLY_BIRD_ENDS)) return 'early-bird'
  // if (now <= new Date(PREORDER_ENDS)) return 'preorder'
  return 'standard'
}

export function getCurrentPrice(now: Date = new Date()): number {
  return PRICES[getCurrentTier(now)]
}