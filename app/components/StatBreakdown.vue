<script setup lang="ts">
import type { StatBreakdown } from '#shared/types/blog'

const props = defineProps<{
  breakdown: StatBreakdown
}>()

const largest = computed(() => Math.max(...props.breakdown.items.map((item) => item.count)))
</script>

<template>
  <figure class="card flex flex-1 flex-col gap-4 md:gap-5">
    <figcaption class="font-display text-lg font-semibold text-ink md:text-xl xl:text-2xl">
      {{ breakdown.label }}
    </figcaption>

    <ul class="flex flex-col gap-3 md:gap-4">
      <li v-for="item in breakdown.items" :key="item.label" class="flex flex-col gap-1 md:gap-1.5">
        <div class="flex items-baseline justify-between gap-4 text-sm md:text-base xl:text-lg">
          <span class="text-ink">{{ item.label }}</span>
          <span class="font-semibold text-ink">
            {{ item.count }}
            <span v-if="breakdown.total !== 100" class="text-xs text-primary md:text-sm"
              >({{ Math.round((item.count / breakdown.total) * 100) }}%)</span
            >
          </span>
        </div>
        <div class="flex h-2 rounded-full bg-subtle md:h-2.5" aria-hidden="true">
          <div
            class="rounded-full font-medium bg-primary"
            :style="{ width: `${(item.count / largest) * 100}%` }"
          />
        </div>
      </li>
    </ul>

    <p v-if="breakdown.note" class="text-xs text-ink-muted md:text-sm">{{ breakdown.note }}</p>
  </figure>
</template>
