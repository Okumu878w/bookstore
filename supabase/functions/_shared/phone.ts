/**
 * Normalizes Kenyan phone numbers to Safaricom's 2547XXXXXXXX / 2541XXXXXXXX
 * format, which is what the Lipwa/Daraja STK push API expects. Accepts
 * 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX, and +-prefixed
 * variants. Returns null if the input doesn't match a valid shape.
 */
export function normalizeKenyanPhone(raw: string): string | null {
  const digits = raw.trim().replace(/[\s-]/g, '').replace(/^\+/, '')

  if (/^0(7|1)\d{8}$/.test(digits)) {
    return '254' + digits.slice(1)
  }
  if (/^254(7|1)\d{8}$/.test(digits)) {
    return digits
  }
  return null
}
