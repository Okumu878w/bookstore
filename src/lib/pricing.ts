// Pricing tiers for Rising Without Losing Yourself.
//
// IMPORTANT: This is for display only. The authoritative price is computed
// server-side in supabase/functions/_shared/pricing.ts — if you change the
// dates or amounts here, change them there too, identically.

export type PriceTier = 'early-bird' | 'preorder' | 'standard'

const EARLY_BIRD_ENDS = '2026-09-13T23:59:59+03:00' // end of day, Africa/Nairobi
const PREORDER_ENDS = '2026-09-20T23:59:59+03:00' // end of day, Africa/Nairobi

const PRICES: Record<PriceTier, number> = {
  'early-bird': 800,
  preorder: 900,
  standard: 1000,
}

const TIER_LABELS: Record<PriceTier, string> = {
  'early-bird': 'Early Bird price',
  preorder: 'Preorder price',
  standard: 'Standard price',
}

export function getCurrentTier(now: Date = new Date()): PriceTier {
  if (now <= new Date(EARLY_BIRD_ENDS)) return 'early-bird'
  if (now <= new Date(PREORDER_ENDS)) return 'preorder'
  return 'standard'
}

export function getCurrentPrice(now: Date = new Date()): number {
  return PRICES[getCurrentTier(now)]
}

export function getTierLabel(tier: PriceTier): string {
  return TIER_LABELS[tier]
}