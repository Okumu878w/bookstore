/**
 * Light client-side check so the customer gets instant feedback.
 * The Edge Function performs the authoritative normalization/validation —
 * never trust this on its own for anything server-side.
 */
export function isLikelyKenyanPhone(value: string): boolean {
  const v = value.trim().replace(/\s+/g, '')
  return /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/.test(v)
}

export function formatPhoneHint(): string {
  return 'e.g. 0712 345 678'
}
