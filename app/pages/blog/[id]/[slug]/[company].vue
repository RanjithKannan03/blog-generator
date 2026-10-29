<script setup lang="ts">
import { sampleBlogs } from '~/data/sampleBlogs'

const route = useRoute()
const id = route.params.id as string
const slug = route.params.slug as string
const companySlug = route.params.company as string

// temp - read from sample data for now
const blog = sampleBlogs.find((b) => b.id === id)
const company = blog?.table?.rows.find((row) => row.slug === companySlug)

if (!blog || !blog.table || !company) {
  throw createError({ statusCode: 404, statusMessage: 'Company not found', fatal: true })
}

const blogPath = `/blog/${blog.id}/${blog.slug}`

if (slug !== blog.slug) {
  await navigateTo(`${blogPath}/${company.slug}`, { redirectCode: 301 })
}

const { rankKey, nameKey, metricKey, descriptionKey, columns } = blog.table
const values = company.values

const name = String(values[nameKey])
const rank = values[rankKey]
const metricColumn = columns.find((c) => c.key === metricKey)
const urlColumn = columns.find((c) => c.type === 'url')
const listColumn = columns.find((c) => c.type === 'list')

const description = descriptionKey ? (values[descriptionKey] as string | null) : null
const website = urlColumn ? (values[urlColumn.key] as string | null) : null
const tags = listColumn ? ((values[listColumn.key] as string[] | null) ?? []) : []

const shownElsewhere = [nameKey, rankKey, metricKey, descriptionKey, urlColumn?.key, listColumn?.key]
const factColumns = columns.filter(
  (c) => !shownElsewhere.includes(c.key) && values[c.key] !== null,
)

const metaDescription =
  description ??
  `${name} is ranked #${rank} in ${blog.title}.`

const canonicalUrl = `${useRequestURL().origin}${blogPath}/${company.slug}`

useSeoMeta({
  title: `${name}: #${rank} ${blog.category} company`,
  description: metaDescription,
  ogTitle: `${name}: #${rank} ${blog.category} company`,
  ogDescription: metaDescription,
  ogUrl: canonicalUrl,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <main class="flex justify-center px-4 pt-2 pb-20 md:px-6 md:pt-10 lg:px-10 xl:px-16">
    <article class="flex w-full max-w-4xl flex-col gap-8 md:gap-10 xl:max-w-5xl">
      <header class="flex flex-col items-start gap-4 md:gap-5">
        <NuxtLink :to="`${blogPath}#ranking`" class="text-base font-medium md:text-lg">
          ← Back to {{ blog.title }}
        </NuxtLink>
        <span class="badge px-3 py-1 text-sm md:px-4 md:text-base">
          #{{ rank }} of {{ blog.rowCount }} · {{ blog.category }}
        </span>
        <h1 class="text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">{{ name }}</h1>
        <p v-if="description" class="text-lg text-ink-muted md:text-xl">{{ description }}</p>
        <a
          v-if="website"
          :href="website"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="btn-secondary hover:no-underline"
        >
          Visit website
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section id="key-facts" aria-labelledby="key-facts-heading" class="flex flex-col gap-4 md:gap-6">
        <h2 id="key-facts-heading" class="text-2xl font-bold md:text-3xl">Key facts</h2>
        <dl class="card flex flex-col divide-y divide-line p-0">
          <div
            v-if="metricColumn"
            class="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between md:px-6"
          >
            <dt class="text-ink-muted">{{ metricColumn.label }}</dt>
            <dd class="font-display text-2xl font-bold text-accent md:text-3xl">
              {{ formatCell(values[metricKey] ?? null, metricColumn.type, false) }}
            </dd>
          </div>
          <div
            v-for="column in factColumns"
            :key="column.key"
            class="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between md:px-6"
          >
            <dt class="text-ink-muted">{{ column.label }}</dt>
            <dd class="font-medium text-ink">
              {{ formatCell(values[column.key] ?? null, column.type, false) }}
            </dd>
          </div>
        </dl>
      </section>

      <section
        v-if="listColumn && tags.length"
        id="tags"
        aria-labelledby="tags-heading"
        class="flex flex-col gap-4 md:gap-6"
      >
        <h2 id="tags-heading" class="text-2xl font-bold md:text-3xl">{{ listColumn.label }}</h2>
        <ul class="flex flex-wrap gap-2 md:gap-3">
          <li v-for="tag in tags" :key="tag" class="badge px-3 py-1 text-sm md:text-base">
            {{ tag }}
          </li>
        </ul>
      </section>
    </article>
  </main>
</template>
