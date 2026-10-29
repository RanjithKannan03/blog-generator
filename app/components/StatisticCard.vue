<script setup lang="ts">
import type { StatHighlight } from '#shared/types/blog'

defineProps<{
  stat: StatHighlight
}>()
</script>

<template>
  <li class="card flex flex-1 flex-col gap-1 p-5 md:gap-1.5 md:p-6">
    <span class="font-display text-3xl font-bold text-accent md:text-4xl xl:text-5xl">
      {{ formatStat(stat.value, stat.format) }}
    </span>
    <span class="text-base font-medium text-ink md:text-lg xl:text-xl">{{ stat.label }}</span>
    <span v-if="stat.note" class="text-sm text-primary md:text-base">{{ stat.note }}</span>
  </li>
</template>
