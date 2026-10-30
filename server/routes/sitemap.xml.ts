const escapeXml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

// lists the home page, the blog list, every blog and every company page
export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event).origin
  const urls: { loc: string; lastmod?: string }[] = [{ loc: '/' }, { loc: '/blog' }]

  for (const summary of await listBlogs()) {
    const blog = await getBlog(summary.id)
    if (!blog) continue

    const blogPath = `/blog/${blog.id}/${blog.slug}`
    urls.push({ loc: blogPath, lastmod: blog.createdAt })
    for (const row of blog.table?.rows ?? []) {
      urls.push({ loc: `${blogPath}/${row.slug}`, lastmod: blog.createdAt })
    }
  }

  const body = urls
    .map(({ loc, lastmod }) => {
      const date = lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''
      return `  <url><loc>${escapeXml(origin + loc)}</loc>${date}</url>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
})
