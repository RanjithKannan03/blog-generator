import type { Blog, BlogSummary } from '#shared/types/blog'

const INDEX_KEY = 'index.json'

function storage() {
  return useStorage('blogs')
}

function toSummary({ id, slug, title, category, rowCount, createdAt }: Blog): BlogSummary {
  return { id, slug, title, category, rowCount, createdAt }
}

export async function listBlogs(): Promise<BlogSummary[]> {
  return (await storage().getItem<BlogSummary[]>(INDEX_KEY)) ?? []
}

export async function getBlog(id: string): Promise<Blog | null> {
  return storage().getItem<Blog>(`${id}.json`)
}

export async function saveBlog(blog: Blog) {
  await storage().setItem(`${blog.id}.json`, blog)

  const index = (await storage().getItem<BlogSummary[]>(INDEX_KEY)) ?? []
  const others = index.filter((summary) => summary.id !== blog.id)
  await storage().setItem(INDEX_KEY, [toSummary(blog), ...others])
}
