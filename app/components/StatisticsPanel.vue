<script setup lang="ts">
import type { StatGrouping, StatHighlight } from '#shared/types/blog'

const props = defineProps<{
  highlights: StatHighlight[]
  grouping?: StatGrouping
}>()

const ALL = 'all'
const selected = ref(ALL)

const visibleHighlights = computed(() => {
  if (selected.value === ALL || !props.grouping) return props.highlights
  return props.grouping.groups.find((group) => group.label === selected.value)?.highlights ?? []
})
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-6">
    <div v-if="grouping" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label for="stat-group" class="text-sm font-medium text-ink md:text-base">
        Group by {{ grouping.label.toLowerCase() }}
      </label>
      <select
        id="stat-group"
        v-model="selected"
        class="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink md:text-base"
      >
        <option :value="ALL">All companies</option>
        <option v-for="group in grouping.groups" :key="group.label" :value="group.label">
          {{ group.label }}
        </option>
      </select>
    </div>

    <ul class="flex flex-col gap-4 sm:flex-row sm:flex-wrap md:gap-6" aria-live="polite">
      <StatisticCard
        v-for="stat in visibleHighlights"
        :key="stat.label"
        :stat="stat"
        class="sm:min-w-[calc(50%-0.5rem)] md:min-w-[calc(50%-0.75rem)]"
      />
    </ul>
  </div>
</template>
