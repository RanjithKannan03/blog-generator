import { randomUUID } from 'node:crypto'
import type { Blog } from '#shared/types/blog'

const MAX_FILE_SIZE = 2 * 1024 * 1024

function badRequest(message: string) {
  return createError({ statusCode: 400, statusMessage: 'Invalid upload', message })
}

async function newId() {
  for (;;) {
    const id = randomUUID().replace(/-/g, '').slice(0, 8)
    if (!(await getBlog(id))) return id
  }
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const file = form?.find((part) => part.name === 'file')
  const category = form
    ?.find((part) => part.name === 'category')
    ?.data.toString('utf8')
    .replace(/[\u0000-\u001f]/g, '')
    .trim()

  if (!file?.filename) throw badRequest('Choose a CSV file to upload.')
  if (!file.filename.toLowerCase().endsWith('.csv')) throw badRequest('The file must be a .csv file.')
  if (file.data.length > MAX_FILE_SIZE) throw badRequest('The file must be smaller than 2 MB.')
  if (!category) throw badRequest('Enter the industry for this dataset.')
  if (category.length > 40) throw badRequest('The industry must be 40 characters or fewer.')

  const table = parseCsv(file.data.toString('utf8'))
  const stats = buildStats(table)
  const copy = await writeCopy({ category, table, stats })

  const blog: Blog = {
    id: await newId(),
    slug: slugify(`top ${table.rows.length} ${category} companies`),
    category,
    rowCount: table.rows.length,
    createdAt: new Date().toISOString(),
    ...copy,
    stats,
    table,
  }

  await saveBlog(blog)
  return { id: blog.id, slug: blog.slug }
})
