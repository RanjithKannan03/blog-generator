import { createError } from 'h3'
import type {
  BlogStats,
  BlogTable,
  CompanyRow,
  StatBreakdown,
  StatFormat,
  StatGrouping,
  StatHighlight,
  TableColumn,
} from '#shared/types/blog'
import { rangeStart } from '#shared/utils/rangeStart'

const MAX_ITEMS = 6
const MAX_DISTINCT = 12
const NEAR_UNIVERSAL = 0.9

type MetricSummary = {
  count: number
  total: number
  median: number
  top: CompanyRow | undefined
}

function numbers(rows: CompanyRow[], key: string) {
  return rows
    .map((row) => row.values[key])
    .filter((value): value is number => typeof value === 'number')
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2
}

function summarise(rows: CompanyRow[], metricKey: string): MetricSummary {
  const values = numbers(rows, metricKey)
  const top = rows
    .filter((row) => typeof row.values[metricKey] === 'number')
    .sort((a, b) => (b.values[metricKey] as number) - (a.values[metricKey] as number))[0]

  return {
    count: rows.length,
    total: values.reduce((sum, value) => sum + value, 0),
    median: values.length ? median(values) : 0,
    top,
  }
}

// "Total Raised" → "raised", "Revenue (£m)" → "revenue"
function metricWord(column: TableColumn) {
  return column.label
    .replace(/\(.*?\)/g, '')
    .replace(/^total\s+/i, '')
    .trim()
    .toLowerCase()
}

function metricHighlights(
  summary: MetricSummary,
  table: BlogTable,
  column: TableColumn,
  format: StatFormat,
): StatHighlight[] {
  const word = metricWord(column)
  const highlights: StatHighlight[] = [
    { label: `Total ${word}`, value: summary.total, format },
    { label: `Median ${word}`, value: summary.median, format, note: 'Half are above, half below' },
  ]

  if (summary.top) {
    const name = summary.top.values[table.nameKey]
    const rank = summary.top.values[table.rankKey]
    highlights.push({
      label: `Highest ${word}`,
      value: summary.top.values[column.key] as number,
      format,
      note: `${name}, ranked #${rank}`,
    })
  }

  return highlights
}

// one value per company (Region, Employees…): counts always add up to the number of companies
function singleValueBreakdown(rows: CompanyRow[], column: TableColumn): StatBreakdown | null {
  const counts = new Map<string, number>()
  let unknown = 0

  for (const row of rows) {
    const value = row.values[column.key]
    if (value === null || value === undefined) unknown++
    else counts.set(String(value), (counts.get(String(value)) ?? 0) + 1)
  }

  // one value for everyone (Stage = Seed) or mostly unique values (years, names) tells the reader nothing
  if (counts.size < 2 || counts.size > MAX_DISTINCT || counts.size > rows.length / 2) return null

  let items = [...counts].map(([label, count]) => ({ label, count }))
  items =
    column.type === 'range'
      ? items.sort((a, b) => (rangeStart(a.label) ?? 0) - (rangeStart(b.label) ?? 0))
      : items.sort((a, b) => b.count - a.count)

  if (column.type !== 'range' && items.length > MAX_ITEMS) {
    const rest = items.slice(MAX_ITEMS - 1)
    items = [
      ...items.slice(0, MAX_ITEMS - 1),
      { label: 'Other', count: rest.reduce((sum, item) => sum + item.count, 0) },
    ]
  }
  if (unknown) items.push({ label: 'Unknown', count: unknown })

  return { label: `Companies by ${column.label.toLowerCase()}`, total: rows.length, items }
}

// several values per company (Industries): counts can add up to more than the number of companies
function tagCounts(rows: CompanyRow[], column: TableColumn) {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const tags = row.values[column.key]
    if (!Array.isArray(tags)) continue
    for (const tag of new Set(tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }

  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .filter((item) => item.count / rows.length <= NEAR_UNIVERSAL)
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_ITEMS)
}

function grouping(
  rows: CompanyRow[],
  table: BlogTable,
  listColumn: TableColumn,
  metricColumn: TableColumn,
  format: StatFormat,
  tags: { label: string }[],
): StatGrouping {
  return {
    label: listColumn.label,
    groups: tags.map((tag) => {
      const groupRows = rows.filter((row) => (row.values[listColumn.key] as string[] | null)?.includes(tag.label))
      const summary = summarise(groupRows, table.metricKey)
      return {
        label: tag.label,
        highlights: [
          { label: 'Companies', value: summary.count, format: 'number', note: `${summary.count} of the top ${rows.length}` },
          ...metricHighlights(summary, table, metricColumn, format),
        ],
      }
    }),
  }
}

function check(condition: boolean, message: string) {
  if (!condition) {
    throw createError({ statusCode: 500, statusMessage: 'Statistics check failed', message })
  }
}

export function buildStats(table: BlogTable): BlogStats {
  const { rows, columns } = table
  const metricColumn = columns.find((column) => column.key === table.metricKey)!
  const format: StatFormat = metricColumn.type === 'money' ? 'money' : 'number'
  const summary = summarise(rows, table.metricKey)

  const highlights = metricHighlights(summary, table, metricColumn, format)

  const skip = new Set([table.nameKey, table.rankKey, table.metricKey, table.descriptionKey])
  const breakdowns: StatBreakdown[] = []

  for (const column of columns) {
    if (skip.has(column.key) || !['text', 'range'].includes(column.type)) continue
    const breakdown = singleValueBreakdown(rows, column)
    if (breakdown) breakdowns.push(breakdown)
  }

  // biggest share of the first breakdown, e.g. "London: 78%"
  const first = breakdowns[0]?.items.find((item) => item.label !== 'Unknown' && item.label !== 'Other')
  if (first && breakdowns[0]) {
    highlights.push({
      label: first.label,
      value: Math.round((first.count / rows.length) * 100),
      format: 'percent',
      note: `${first.count} of ${rows.length} companies`,
    })
  }

  let statGrouping: StatGrouping | undefined
  const listColumn = columns.find((column) => column.type === 'list')
  if (listColumn) {
    const tags = tagCounts(rows, listColumn)
    if (tags.length) {
      breakdowns.push({
        label: `Top ${listColumn.label.toLowerCase()}`,
        total: rows.length,
        note: `Companies can have several ${listColumn.label.toLowerCase()}, so percentages add up to more than 100%.`,
        items: tags,
      })
      statGrouping = grouping(rows, table, listColumn, metricColumn, format, tags)
    }
  }

  // sanity checks: every number must be consistent with the rows it came from
  const values = numbers(rows, table.metricKey)
  if (values.length) {
    check(Math.min(...values) <= summary.median && summary.median <= Math.max(...values), 'Median is outside the range of values.')
  }
  for (const breakdown of breakdowns) {
    if (breakdown.note) continue
    const sum = breakdown.items.reduce((total, item) => total + item.count, 0)
    check(sum === rows.length, `“${breakdown.label}” counts ${sum} companies instead of ${rows.length}.`)
  }
  for (const group of statGrouping?.groups ?? []) {
    const total = group.highlights.find((h) => h.label.startsWith('Total'))?.value ?? 0
    check(total <= summary.total, `“${group.label}” total is larger than the overall total.`)
  }

  return { highlights, grouping: statGrouping, breakdowns }
}
