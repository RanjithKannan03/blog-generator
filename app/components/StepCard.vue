<script setup lang="ts">
defineProps<{
  number: number
  title: string
  text: string
  showArrow?: boolean
}>()
</script>

<template>
  <li class="flex flex-1 flex-col items-center md:flex-row">
    <div
      class="card flex w-full flex-1 flex-col gap-3 self-stretch transition-shadow hover:shadow-card-hover"
    >
      <div class="flex items-center gap-3">
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-base font-bold text-primary md:size-10 md:text-lg"
        >
          {{ number }}
        </span>
        <h3 class="text-lg font-semibold md:text-xl">{{ title }}</h3>
      </div>
      <p class="text-ink-muted">{{ text }}</p>
    </div>

    <svg
      v-if="showArrow"
      class="my-2 size-7 shrink-0 rotate-90 text-accent md:mx-3 md:my-0 md:rotate-0 lg:mx-4 lg:size-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </li>
</template>
