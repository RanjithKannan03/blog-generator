<script setup lang="ts">
defineProps<{
  slug: string
  title: string
  category: string
  rowCount: number
  createdAt: string
}>()
</script>

<template>
  <li class="flex">
    <article
      class="card flex w-full flex-col gap-3 transition-shadow hover:shadow-card-hover md:gap-4"
    >
      <span class="badge self-start">{{ category }}</span>

      <h3 class="text-lg leading-snug md:text-xl">
        <NuxtLink :to="`/blog/${slug}`" class="text-ink hover:text-primary hover:no-underline">
          {{ title }}
        </NuxtLink>
      </h3>

      <p class="mt-auto flex items-center gap-2 text-sm text-ink-muted">
        <span>{{ rowCount }} companies</span>
        <span aria-hidden="true">·</span>
        <time :datetime="createdAt">
          {{ new Date(createdAt).toLocaleDateString('en-GB', { dateStyle: 'medium' }) }}
        </time>
      </p>
    </article>
  </li>
</template>
