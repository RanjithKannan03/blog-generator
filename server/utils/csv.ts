import Papa from 'papaparse'
import { createError } from 'h3'
import type { BlogTable, CellValue, ColumnType, CompanyRow, TableColumn } from '#shared/types/blog'
import { slugify } from './slugify'

const MAX_ROWS = 1000
const MAX_COLUMNS = 40
const MAX_TABLE_COLUMNS = 6

const MISSING = new Set(['', 'n/a', 'na', '-', '—', 'none', 'null', 'unknown'])

type Role = 'rank' | 'name' | 'metric' | 'description'

type RoleRule = {
  words: string[]
  types: ColumnType[]
}

// Earlier words win when several columns match the same role
const ROLE_RULES: Record<Role, RoleRule> = {
  rank: { words: ['rank', 'ranking', 'position'], types: ['number'] },
  name: { words: ['company', 'name', 'organisation', 'organization', 'business'], types: ['text'] },
  metric: {
    words: ['raised', 'funding', 'revenue', 'turnover', 'valuation', 'investment', 'sales'],
    types: ['money', 'number'],
  },
  description: { words: ['description', 'summary', 'about', 'overview'], types: ['text'] },
}

const URL_WORDS = ['website', 'url', 'link', 'homepage', 'site']
const YEAR_WORDS = ['year', 'founded', 'established', 'incorporated']
const MONEY_WORDS = [
  'raised',
  'funding',
  'revenue',
  'turnover',
  'valuation',
  'investment',
  'sales',
  'price',
  'cost',
]
const NOT_A_METRIC = /\b(year|founded|id|rank|age|postcode|zip|phone)\b/

type RawColumn = {
  key: string
  label: string
  words: string[]
  type: ColumnType
  values: string[]
}

function badRequest(message: string) {
  return createError({ statusCode: 400, statusMessage: 'Invalid CSV', message })
}

// ---------- value checks ----------

const isMissing = (value: string) => MISSING.has(value.trim().toLowerCase())
const isUrl = (value: string) => /^https?:\/\/\S+$/i.test(value)
const isRange = (value: string) => /^(<\s*[\d,]+|[\d,]+\s*[-–]\s*[\d,]+|[\d,]+\s*\+)$/.test(value)
const isNumberLike = (value: string) => /^[£$€]?\s*-?[\d,]*\.?\d+\s*(k|m|bn)?$/i.test(value)
const hasCurrency = (value: string) => /[£$€]/.test(value)
const isYear = (value: string) => /^(18|19|20)\d{2}$/.test(value)

function headerWords(header: string) {
  return header
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function toKey(header: string, index: number) {
  const words = headerWords(header)
  if (!words.length) return `column${index + 1}`
  return words.map((word, i) => (i === 0 ? word : word[0]!.toUpperCase() + word.slice(1))).join('')
}

// "£30,314,247" → 30314247, "£1.2bn" → 1200000000, "12.5" with header "(£m)" → 12500000
function parseNumber(value: string, headerMultiplier = 1): number | null {
  const match = value
    .replace(/[£$€,\s]/g, '')
    .toLowerCase()
    .match(/^(-?\d*\.?\d+)(k|m|bn)?$/)
  if (!match) return null

  const suffix = { k: 1e3, m: 1e6, bn: 1e9 }[match[2] as 'k' | 'm' | 'bn'] ?? 1
  return Number(match[1]) * (match[2] ? suffix : headerMultiplier)
}

// Headers like "Revenue (£m)" mean every value is in millions
function headerMultiplier(header: string) {
  const text = header.toLowerCase()
  if (/\(\s*[£$€]?\s*bn\s*\)|billions?/.test(text)) return 1e9
  if (/\(\s*[£$€]?\s*m\s*\)|millions?/.test(text)) return 1e6
  if (/\(\s*[£$€]?\s*k\s*\)|thousands?|000s/.test(text)) return 1e3
  return 1
}

// ---------- column types ----------

function share(values: string[], test: (value: string) => boolean) {
  return values.filter(test).length / values.length
}

function detectType(words: string[], values: string[]): ColumnType {
  const filled = values.filter((value) => !isMissing(value))
  if (!filled.length) return 'text'

  const urlHeader = words.some((word) => URL_WORDS.includes(word))
  if (share(filled, isUrl) >= (urlHeader ? 0.5 : 0.8)) return 'url'
  if (share(filled, (value) => value.includes(';')) >= 0.3) return 'list'
  if (share(filled, isRange) >= 0.8) return 'range'
  if (words.some((word) => YEAR_WORDS.includes(word)) && share(filled, isYear) >= 0.9) return 'text'
  if (share(filled, isNumberLike) >= 0.9) {
    const moneyHeader = words.some((word) => MONEY_WORDS.includes(word))
    return moneyHeader || share(filled, hasCurrency) >= 0.5 ? 'money' : 'number'
  }
  return 'text'
}

function normalise(value: string, column: RawColumn): CellValue {
  const text = value.trim()
  if (isMissing(text)) return null

  switch (column.type) {
    case 'money':
    case 'number':
      return parseNumber(text, headerMultiplier(column.label))
    case 'list': {
      const items = text
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
      return items.length ? items : null
    }
    case 'url':
      // only real web links, so a cell like "javascript:..." can never become a link
      return isUrl(text) ? text : null
    default:
      return text
  }
}

// ---------- special columns ----------

function averageLength(column: RawColumn) {
  const filled = column.values.filter((value) => !isMissing(value))
  return filled.reduce((sum, value) => sum + value.length, 0) / Math.max(filled.length, 1)
}

function distinctCount(column: RawColumn) {
  const filled = column.values.filter((value) => !isMissing(value))
  return new Set(filled.map((value) => value.toLowerCase())).size
}

function uniqueShare(column: RawColumn) {
  const filled = column.values.filter((value) => !isMissing(value)).length
  return distinctCount(column) / Math.max(filled, 1)
}

function findByHeader(columns: RawColumn[], role: Role, taken: Set<string>) {
  const rule = ROLE_RULES[role]
  for (const word of rule.words) {
    const match = columns.find(
      (column) =>
        !taken.has(column.key) && rule.types.includes(column.type) && column.words.includes(word),
    )
    if (match) return match
  }
  // a header that is just "#" is a rank column
  if (role === 'rank') {
    return columns.find((c) => !taken.has(c.key) && c.type === 'number' && c.label.trim() === '#')
  }
}

function pickRoles(columns: RawColumn[]) {
  const taken = new Set<string>()
  const take = (column?: RawColumn) => {
    if (column) taken.add(column.key)
    return column
  }
  const free = (type: ColumnType) =>
    columns.filter((column) => !taken.has(column.key) && column.type === type)

  const rank = take(findByHeader(columns, 'rank', taken))

  // names are unique and short; descriptions are unique but long; regions repeat
  const name = take(
    findByHeader(columns, 'name', taken) ??
      free('text')
        .filter((column) => averageLength(column) <= 60)
        .sort((a, b) => uniqueShare(b) - uniqueShare(a) || averageLength(a) - averageLength(b))[0],
  )

  const metric = take(
    findByHeader(columns, 'metric', taken) ??
      free('money')[0] ??
      free('number').find((column) => !NOT_A_METRIC.test(column.label.toLowerCase())),
  )

  const description = take(
    findByHeader(columns, 'description', taken) ??
      free('text')
        .filter((column) => averageLength(column) > 40)
        .sort((a, b) => averageLength(b) - averageLength(a))[0],
  )

  return { rank, name, metric, description }
}

// ---------- main ----------

export function parseCsv(text: string): BlogTable {
  const result = Papa.parse<Record<string, string>>(text.replace(/^﻿/, ''), {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  })

  const headers = (result.meta.fields ?? []).filter(Boolean)
  const data = result.data

  if (!headers.length) throw badRequest('The CSV has no header row.')
  if (!data.length) throw badRequest('The CSV has a header row but no data rows.')
  if (data.length > MAX_ROWS) throw badRequest(`The CSV has more than ${MAX_ROWS} rows.`)
  if (headers.length > MAX_COLUMNS)
    throw badRequest(`The CSV has more than ${MAX_COLUMNS} columns.`)
  if (result.errors.length > data.length * 0.1) {
    throw badRequest(
      'Too many rows have the wrong number of columns. Check the file is a valid CSV.',
    )
  }

  const usedKeys = new Set<string>()
  const rawColumns: RawColumn[] = headers.map((header, index) => {
    let key = toKey(header, index)
    while (usedKeys.has(key)) key += '_'
    usedKeys.add(key)

    const values = data.map((row) => String(row[header] ?? ''))
    const words = headerWords(header)
    return { key, label: header, words, type: detectType(words, values), values }
  })

  const roles = pickRoles(rawColumns)
  if (!roles.name) {
    throw badRequest(
      'Couldn’t find a company name column. Add a header such as “Company” or “Name”.',
    )
  }
  if (!roles.metric) {
    throw badRequest('Couldn’t find a numeric column to rank by, such as funding or revenue.')
  }
  const { name, metric } = roles

  let rows: CompanyRow[] = data
    .map((_, rowIndex) => {
      const values: Record<string, CellValue> = {}
      for (const column of rawColumns)
        values[column.key] = normalise(column.values[rowIndex]!, column)
      return { slug: '', values }
    })
    .filter((row) => row.values[name.key] !== null)

  if (!rows.length) throw badRequest('No rows have a company name.')

  // use the CSV's own ranking if it has one, otherwise rank by the metric (highest first)
  let rankKey = roles.rank?.key
  const byValue = (key: string, direction: 1 | -1) => (a: CompanyRow, b: CompanyRow) => {
    const x = a.values[key] as number | null
    const y = b.values[key] as number | null
    if (x === null) return 1
    if (y === null) return -1
    return (x - y) * direction
  }

  if (rankKey) {
    rows.sort(byValue(rankKey, 1))
  } else {
    rankKey = usedKeys.has('rank') ? 'rank_' : 'rank'
    rows.sort(byValue(metric.key, -1))
    rows = rows.map((row, index) => ({ ...row, values: { ...row.values, [rankKey!]: index + 1 } }))
  }

  const slugCounts = new Map<string, number>()
  for (const [index, row] of rows.entries()) {
    const base = slugify(String(row.values[name.key])) || `company-${index + 1}`
    const count = (slugCounts.get(base) ?? 0) + 1
    slugCounts.set(base, count)
    row.slug = count === 1 ? base : `${base}-${count}`
  }

  // table: rank, name, up to a few short columns, then the metric; everything else on company pages
  const special = new Set([rankKey, name.key, metric.key, roles.description?.key])
  const extraTableKeys = rawColumns
    .filter(
      (column) =>
        !special.has(column.key) &&
        ['text', 'range', 'number', 'money'].includes(column.type) &&
        averageLength(column) <= 30 &&
        distinctCount(column) > 1,
    )
    .slice(0, MAX_TABLE_COLUMNS - 3)
    .map((column) => column.key)

  const toColumn = (column: RawColumn): TableColumn => ({
    key: column.key,
    label: column.label,
    type: column.type,
    showInTable:
      column.key === name.key || column.key === metric.key || extraTableKeys.includes(column.key),
  })

  const rankColumn: TableColumn = roles.rank
    ? { ...toColumn(roles.rank), showInTable: true }
    : { key: rankKey, label: 'Rank', type: 'number', showInTable: true }

  const others = rawColumns.filter(
    (column) => column !== roles.rank && column !== name && column !== metric,
  )
  const columns: TableColumn[] = [
    rankColumn,
    toColumn(name),
    ...others.filter((column) => extraTableKeys.includes(column.key)).map(toColumn),
    toColumn(metric),
    ...others.filter((column) => !extraTableKeys.includes(column.key)).map(toColumn),
  ]

  return {
    rankKey,
    nameKey: name.key,
    metricKey: metric.key,
    descriptionKey: roles.description?.key,
    columns,
    rows,
  }
}
