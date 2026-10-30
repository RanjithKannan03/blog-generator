import type { BlogSection, BlogStats, BlogTable } from '#shared/types/blog'
import { formatStat } from '#shared/utils/formatStat'

export type BlogCopy = {
  title: string
  metaDescription: string
  introduction: string
  sections: BlogSection[]
}

export type CopyInput = {
  category: string
  table: BlogTable
  stats: BlogStats
}

// temp - writes the copy from the stats without an LLM; Gemini replaces this next
export async function writeCopy({ category, table, stats }: CopyInput): Promise<BlogCopy> {
  const count = table.rows.length
  const metric = table.columns.find((column) => column.key === table.metricKey)!
  const format = metric.type === 'money' ? 'money' : 'number'
  const [total, median, highest] = stats.highlights

  const top3 = table.rows.slice(0, 3).map((row) => {
    const value = row.values[table.metricKey]
    const amount = typeof value === 'number' ? ` (${formatStat(value, format)})` : ''
    return `${row.values[table.nameKey]}${amount}`
  })

  const sections: BlogSection[] = [
    {
      heading: `Which ${category} companies lead the ranking?`,
      paragraphs: [
        `The top three are ${top3.join(', ')}.`,
        total && median
          ? `Together, the ${count} companies account for ${formatStat(total.value, format)}, with a median of ${formatStat(median.value, format)}.`
          : `The ranking covers ${count} companies.`,
      ],
    },
    ...stats.breakdowns.slice(0, 3).map((breakdown) => {
      // biggest groups first, whatever order the breakdown is displayed in
      const [first, second] = breakdown.items
        .filter((item) => item.label !== 'Unknown' && item.label !== 'Other')
        .sort((a, b) => b.count - a.count)
      return {
        heading: `${category} companies: ${breakdown.label.replace(/^Companies by /, 'by ').toLowerCase()}`,
        paragraphs: [
          first
            ? `${first.label} is the most common, with ${first.count} of ${count} companies${second ? `, followed by ${second.label} with ${second.count}` : ''}.`
            : '',
        ].filter(Boolean),
      }
    }),
  ]

  const metricName = metric.label.replace(/\(.*?\)/g, '').trim()
  const title = `Top ${count} ${category} Companies by ${metricName}`

  return {
    title,
    metaDescription: `The top ${count} ${category} companies ranked by ${metricName.toLowerCase()}, with key statistics and the full ranking table.`.slice(0, 160),
    introduction: `This ranking lists the top ${count} ${category} companies by ${metricName.toLowerCase()}${highest ? `, led by ${highest.note?.split(',')[0]}` : ''}. Below are the key statistics, insights and the full table.`,
    sections,
  }
}
