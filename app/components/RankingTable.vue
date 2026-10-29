<script setup lang="ts">
import type { BlogTable, CellValue, TableColumn } from '#shared/types/blog'

const props = defineProps<{
  table: BlogTable
  caption: string
  blogPath: string
}>()

type Direction = 'asc' | 'desc'

const sortKey = ref(props.table.rankKey)
const direction = ref<Direction>('asc')

const visibleColumns = computed(() => props.table.columns.filter((column) => column.showInTable))

const collator = new Intl.Collator('en-GB', { numeric: true, sensitivity: 'base' })

function sortValue(value: CellValue, column: TableColumn): CellValue {
  if (column.type === 'range' && typeof value === 'string') return rangeStart(value)
  return value
}

function compare(a: CellValue, b: CellValue) {
  if (a === null) return 1
  if (b === null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a), String(b))
}

const sortedRows = computed(() => {
  const column = props.table.columns.find((c) => c.key === sortKey.value)
  if (!column) return props.table.rows
  const sign = direction.value === 'asc' ? 1 : -1

  return [...props.table.rows].sort((rowA, rowB) => {
    const a = sortValue(rowA.values[column.key] ?? null, column)
    const b = sortValue(rowB.values[column.key] ?? null, column)
    // empty values always go last
    if (a === null || b === null) return compare(a, b)
    return compare(a, b) * sign
  })
})

function sortBy(column: TableColumn) {
  if (sortKey.value === column.key) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortKey.value = column.key
  // money and counts read best largest-first
  direction.value = column.type === 'money' ? 'desc' : 'asc'
}

function ariaSort(column: TableColumn) {
  if (sortKey.value !== column.key) return 'none'
  return direction.value === 'asc' ? 'ascending' : 'descending'
}

function isAlwaysVisible(column: TableColumn) {
  return [props.table.rankKey, props.table.nameKey, props.table.metricKey].includes(column.key)
}

function isNumeric(column: TableColumn) {
  return column.type === 'money' || column.type === 'number'
}
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
    <table class="w-full border-collapse text-left text-sm md:text-base">
      <caption class="px-4 py-3 text-left text-sm text-ink-muted md:px-6 md:text-base">
        {{
          caption
        }}
      </caption>

      <thead class="bg-subtle">
        <tr>
          <th
            v-for="column in visibleColumns"
            :key="column.key"
            scope="col"
            :aria-sort="ariaSort(column)"
            class="px-4 py-3 font-semibold whitespace-nowrap text-ink md:px-6"
            :class="[
              isNumeric(column) && column.key !== table.rankKey ? 'text-right' : '',
              isAlwaysVisible(column) ? '' : 'hidden md:table-cell',
            ]"
          >
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded hover:text-primary"
              @click="sortBy(column)"
            >
              {{ column.label }}
              <span
                aria-hidden="true"
                class="text-xs"
                :class="sortKey === column.key ? 'text-primary' : 'text-ink-muted/50'"
              >
                {{ sortKey === column.key ? (direction === 'asc' ? '▲' : '▼') : '↕' }}
              </span>
            </button>
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-line">
        <tr v-for="row in sortedRows" :key="row.slug" class="hover:bg-subtle/60">
          <template v-for="column in visibleColumns" :key="column.key">
            <th
              v-if="column.key === table.nameKey"
              scope="row"
              class="px-4 py-3 font-medium md:px-6"
            >
              <NuxtLink :to="`${blogPath}/${row.slug}`">
                {{ formatCell(row.values[column.key] ?? null, column.type) }}
              </NuxtLink>
            </th>
            <td
              v-else
              class="px-4 py-3 md:px-6"
              :class="[
                isNumeric(column) ? 'tabular-nums' : '',
                isNumeric(column) && column.key !== table.rankKey ? 'text-right' : '',
                column.key === table.rankKey ? 'font-semibold text-ink-muted' : '',
                isAlwaysVisible(column) ? '' : 'hidden md:table-cell',
              ]"
            >
              {{ formatCell(row.values[column.key] ?? null, column.type) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
