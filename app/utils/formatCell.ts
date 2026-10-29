import type { CellValue, ColumnType } from '#shared/types/blog'

const moneyFull = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

export function formatCell(value: CellValue, type: ColumnType, compact = true) {
  if (value === null || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ')
  if (type === 'money' && typeof value === 'number') {
    return compact ? formatStat(value, 'money') : moneyFull.format(value)
  }
  if (type === 'number' && typeof value === 'number') return formatStat(value, 'number')
  return String(value)
}
