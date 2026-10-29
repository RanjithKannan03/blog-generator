<script setup lang="ts">
import type { BlogSummary } from '#shared/types/blog'

defineProps<{
  blog: BlogSummary
}>()
</script>

<template>
  <li class="flex">
    <article
      class="card group relative flex w-full flex-col gap-3 transition-shadow hover:shadow-card-hover focus-within:shadow-card-hover md:gap-4"
    >
      <span class="badge self-start">{{ blog.category }}</span>

      <h3 class="text-lg leading-snug md:text-xl">
        <NuxtLink :to="`/blog/${blog.id}/${blog.slug}`" class="text-ink group-hover:text-primary hover:no-underline focus-visible:outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring">
          {{ blog.title }}
        </NuxtLink>
      </h3>

      <p class="mt-auto flex items-center gap-2 text-sm text-ink-muted">
        <span>{{ blog.rowCount }} companies</span>
        <span aria-hidden="true">·</span>
        <time :datetime="blog.createdAt">
          {{ new Date(blog.createdAt).toLocaleDateString('en-GB', { dateStyle: 'medium' }) }}
        </time>
      </p>
    </article>
  </li>
</template>
