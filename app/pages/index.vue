<script setup lang="ts">
import { sampleBlogs } from '~/data/sampleBlogs'

useSeoMeta({
  title: 'Blog Generator',
  description: 'Turn company datasets into SEO-optimised blog posts.',
})

const steps = [
  {
    title: 'Upload a CSV',
    text: 'Choose a company dataset from any industry. Columns are detected automatically.',
  },
  {
    title: 'AI writes the copy',
    text: 'Statistics are calculated from the data, then an LLM turns them into an SEO-friendly article.',
  },
  {
    title: 'Publish the blog',
    text: 'A new server-rendered blog page is created with a ranking table, insights and FAQ.',
  },
]

const blogs = ref(sampleBlogs)

const latestBlogs = computed(() => blogs.value.slice(0, 3))
</script>

<template>
  <main
    class="flex flex-col gap-10 px-6 pt-5 pb-20 md:gap-16 md:px-8 md:pt-10 lg:gap-20 lg:px-16 xl:px-37.5"
  >
    <section
      id="hero"
      aria-labelledby="hero-heading"
      class="flex flex-col items-start gap-5 md:gap-6"
    >
      <h1
        id="hero-heading"
        class="max-w-3xl text-4xl leading-tight font-bold md:text-5xl lg:text-6xl"
      >
        Turn company datasets into SEO-optimised blogs
      </h1>
      <p class="max-w-2xl text-lg text-ink-muted md:text-xl">
        Upload a CSV of companies and get a published article with a ranking table, statistics and
        AI-written insights, in one step.
      </p>
      <div class="flex flex-col gap-3 sm:flex-row">
        <NuxtLink to="/upload" class="btn-primary hover:no-underline md:px-6 md:py-3 md:text-base">
          Upload a CSV
        </NuxtLink>
        <NuxtLink to="/blog" class="btn-secondary hover:no-underline md:px-6 md:py-3 md:text-base">
          Browse blogs
        </NuxtLink>
      </div>
    </section>

    <section id="how-it-works" aria-labelledby="how-heading" class="flex flex-col gap-6 md:gap-8">
      <h2 id="how-heading" class="text-2xl font-bold md:text-3xl">How it works</h2>
      <ol class="flex flex-col md:flex-row">
        <StepCard
          v-for="(step, index) in steps"
          :key="step.title"
          :number="index + 1"
          :title="step.title"
          :text="step.text"
          :show-arrow="index < steps.length - 1"
        />
      </ol>
    </section>

    <section
      id="latest-blogs"
      aria-labelledby="latest-heading"
      class="flex flex-col gap-6 md:gap-8"
    >
      <div class="flex items-end justify-between gap-4">
        <h2 id="latest-heading" class="text-2xl font-bold md:text-3xl">Latest blogs</h2>
        <NuxtLink v-if="blogs.length" to="/blog" class="text-sm font-medium md:text-base">
          View all →
        </NuxtLink>
      </div>

      <ul v-if="latestBlogs.length" class="flex flex-col gap-4 md:flex-row md:gap-6">
        <BlogCard v-for="blog in latestBlogs" :key="blog.id" :blog="blog" class="md:w-1/3" />
      </ul>

      <div v-else class="card flex flex-col items-start gap-3">
        <p class="text-ink-muted">No blogs yet. Upload your first CSV to generate one.</p>
        <NuxtLink to="/upload" class="btn-primary hover:no-underline">Upload a CSV</NuxtLink>
      </div>
    </section>
  </main>
</template>
