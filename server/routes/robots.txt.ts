// dynamic so the sitemap link uses whatever domain the site is served from
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Disallow:

Sitemap: ${getRequestURL(event).origin}/sitemap.xml
`
})
