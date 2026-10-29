<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const slug = route.params.slug as string

const { data } = await useFetch(`/api/blogs/${id}`)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Blog not found', fatal: true })
}

const blog = data.value

if (slug !== blog.slug) {
  await navigateTo(`/blog/${blog.id}/${blog.slug}`, { redirectCode: 301 })
}

const canonicalUrl = `${useRequestURL().origin}/blog/${blog.id}/${blog.slug}`

useSeoMeta({
  title: blog.title,
  description: blog.metaDescription,
  ogTitle: blog.title,
  ogDescription: blog.metaDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

const metricLabel = blog.table?.columns.find((c) => c.key === blog.table?.metricKey)?.label
const rankingCaption = `${blog.rowCount} ${blog.category} companies ranked by ${metricLabel?.toLowerCase() ?? 'rank'}`

const publishedDate =new Date(blog.createdAt).toLocaleDateString('en-GB', { dateStyle: 'long' })
</script>

<template>
  <main class="flex justify-center px-4 pt-2 pb-20 md:px-6 md:pt-10 lg:px-10 xl:px-16">
    <article class="flex w-full max-w-4xl flex-col gap-10 md:gap-12 xl:max-w-5xl">
      <header class="flex flex-col items-start gap-4 md:gap-5">
        <NuxtLink to="/blog" class="text-base font-medium md:text-lg">← All blogs</NuxtLink>
        <span class="badge px-3 py-1 text-sm md:px-4 md:text-base">{{ blog.category }}</span>
        <h1 class="text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">{{ blog.title }}</h1>
        <p class="flex items-center gap-2 text-sm text-ink-muted md:text-base">
          <time :datetime="blog.createdAt">{{ publishedDate }}</time>
          <span aria-hidden="true">·</span>
          <span>{{ blog.rowCount }} companies</span>
        </p>
        <p class="text-lg text-ink-muted md:text-xl">{{ blog.introduction }}</p>
      </header>

      <section id="key-statistics" aria-labelledby="key-statistics-heading" class="flex flex-col gap-6">
        <h2 id="key-statistics-heading" class="text-2xl font-bold md:text-3xl">Key statistics</h2>

        <StatisticsPanel :highlights="blog.stats.highlights" :grouping="blog.stats.grouping" />

        <div class="flex flex-col gap-4 md:gap-6 lg:flex-row lg:flex-wrap">
          <StatBreakdown
            v-for="breakdown in blog.stats.breakdowns"
            :key="breakdown.label"
            :breakdown="breakdown"
            class="lg:min-w-[calc(50%-0.75rem)]"
          />
        </div>
      </section>

      <section
        v-for="(section, index) in blog.sections"
        :id="`section-${index + 1}`"
        :key="section.heading"
        :aria-labelledby="`section-${index + 1}-heading`"
        class="flex flex-col gap-2 md:gap-4"
      >
        <h2 :id="`section-${index + 1}-heading`" class="text-2xl font-bold md:text-3xl">
          {{ section.heading }}
        </h2>
        <p
          v-for="paragraph in section.paragraphs"
          :key="paragraph"
          class="text-base leading-relaxed md:text-lg"
        >
          {{ paragraph }}
        </p>
      </section>

      <section
        v-if="blog.table"
        id="ranking"
        aria-labelledby="ranking-heading"
        class="flex flex-col gap-4 md:gap-6"
      >
        <h2 id="ranking-heading" class="text-2xl font-bold md:text-3xl">
          Full ranking: {{ blog.rowCount }} {{ blog.category }} companies
        </h2>
        <RankingTable
          :table="blog.table"
          :caption="rankingCaption"
          :blog-path="`/blog/${blog.id}/${blog.slug}`"
        />
      </section>
    </article>
  </main>
</template>
