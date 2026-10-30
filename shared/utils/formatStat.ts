import type { StatFormat } from '#shared/types/blog'

const money = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const number = new Intl.NumberFormat('en-GB')

export function formatStat(value: number, format: StatFormat) {
  if (format === 'money') return money.format(value)
  if (format === 'percent') return `${value}%`
  return number.format(value)
}
