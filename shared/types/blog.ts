export type BlogSummary = {
  id: string
  slug: string
  title: string
  category: string
  rowCount: number
  createdAt: string
}

export type BlogSection = {
  heading: string
  paragraphs: string[]
}

export type StatFormat = 'money' | 'number' | 'percent'

export type StatHighlight = {
  label: string
  value: number
  format: StatFormat
  note?: string
}

export type StatBreakdown = {
  label: string
  total: number
  note?: string
  items: { label: string; count: number }[]
}

export type StatGroup = {
  label: string
  highlights: StatHighlight[]
}

export type StatGrouping = {
  label: string
  groups: StatGroup[]
}

export type BlogStats = {
  highlights: StatHighlight[]
  grouping?: StatGrouping
  breakdowns: StatBreakdown[]
}

export type ColumnType = 'text' | 'number' | 'money' | 'range' | 'list' | 'url'

export type TableColumn = {
  key: string
  label: string
  type: ColumnType
  showInTable: boolean
}

export type CellValue = string | number | string[] | null

export type CompanyRow = {
  slug: string
  values: Record<string, CellValue>
}

export type BlogTable = {
  rankKey: string
  nameKey: string
  metricKey: string
  descriptionKey?: string
  columns: TableColumn[]
  rows: CompanyRow[]
}

export type Blog = BlogSummary & {
  metaDescription: string
  introduction: string
  stats: BlogStats
  sections: BlogSection[]
  table?: BlogTable
}
