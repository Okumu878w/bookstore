// Pricing for Rising Without Losing Yourself.
//
// IMPORTANT: This is for display only. The authoritative price is computed
// server-side in supabase/functions/_shared/pricing.ts — if you change the
// amount here, change it there too, identically.

export type PriceTier = 'standard'
// If early-bird or preorder tiers ever come back, add them here too.

const PRICES: Record<PriceTier, number> = {
  standard: 1000,
}

const TIER_LABELS: Record<PriceTier, string> = {
  standard: 'Standard Price',
}

export function getCurrentTier(_now: Date = new Date()): PriceTier {
  return 'standard'
}

export function getCurrentPrice(now: Date = new Date()): number {
  return PRICES[getCurrentTier(now)]
}

export function getTierLabel(tier: PriceTier): string {
  return TIER_LABELS[tier]
}