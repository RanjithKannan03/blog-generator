export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const blog = await getBlog(id)

  if (!blog) {
    throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
  }

  return blog
})
