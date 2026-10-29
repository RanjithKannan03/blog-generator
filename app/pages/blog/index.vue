<script setup lang="ts">
useSeoMeta({
  title: 'Blogs',
  description: 'SEO-optimised blogs generated from company datasets.',
})

const { data: blogs } = await useFetch('/api/blogs', { default: () => [] })
</script>

<template>
  <main class="flex flex-col gap-8 px-6 pt-10 pb-20 md:gap-10 md:px-8 md:pt-16 lg:px-16 xl:px-37.5">
    <h1 class="text-3xl font-bold md:text-4xl lg:text-5xl">Blogs</h1>

    <ul v-if="blogs.length" class="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6">
      <BlogCard
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
        class="md:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]"
      />
    </ul>

    <p v-else class="text-ink-muted">
      No blogs yet. <NuxtLink to="/upload">Upload a CSV</NuxtLink> to generate one.
    </p>
  </main>
</template>
