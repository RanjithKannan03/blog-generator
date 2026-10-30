// "<5" → 0, "5-9" → 5, "1,000-4,999" → 1000, "5,000+" → 5000, "Unknown" → null
export function rangeStart(value: string): number | null {
  const text = value.replace(/,/g, '').trim()
  if (text.startsWith('<')) return 0
  const match = text.match(/^\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}
