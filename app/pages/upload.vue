<script setup lang="ts">
useSeoMeta({
  title: 'Upload a company dataset',
  description:
    'Upload a CSV of companies from any industry and generate an SEO-optimised blog with a ranking table, statistics and AI-written insights.',
})

const MAX_FILE_SIZE = 2 * 1024 * 1024

const file = ref<File | null>(null)
const category = ref('')
const status = ref<'idle' | 'uploading' | 'error'>('idle')
const errorMessage = ref('')

const isUploading = computed(() => status.value === 'uploading')
const fileSize = computed(() => (file.value ? `${(file.value.size / 1024).toFixed(1)} KB` : ''))

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
  status.value = 'idle'
  errorMessage.value = ''
}

function showError(message: string) {
  status.value = 'error'
  errorMessage.value = message
}

async function onSubmit() {
  if (!file.value) return showError('Choose a CSV file to upload.')
  if (!file.value.name.toLowerCase().endsWith('.csv')) return showError('The file must be a .csv file.')
  if (file.value.size > MAX_FILE_SIZE) return showError('The file must be smaller than 2 MB.')
  if (!category.value.trim()) return showError('Enter the industry for this dataset.')

  status.value = 'uploading'
  errorMessage.value = ''

  const body = new FormData()
  body.append('file', file.value)
  body.append('category', category.value.trim())

  try {
    const blog = await $fetch<{ id: string; slug: string }>('/api/upload', { method: 'POST', body })
    await navigateTo(`/blog/${blog.id}/${blog.slug}`)
  } catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    showError(message ?? 'Something went wrong while generating the blog. Please try again.')
  }
}
</script>

<template>
  <main class="flex justify-center px-6 pt-10 pb-20 md:px-8 md:pt-16 lg:px-16 xl:px-37.5">
    <div class="flex w-full max-w-2xl flex-col gap-8 md:gap-10">
      <header class="flex flex-col gap-3 md:gap-4">
        <h1 class="text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
          Upload a company dataset
        </h1>
        <p class="text-lg text-ink-muted md:text-xl">
          Upload a CSV of companies from any industry. We calculate the statistics, an AI writes
          the article, and a new blog page is published with the full ranking table.
        </p>
      </header>

      <form
        class="card flex flex-col gap-6 md:gap-8"
        :aria-busy="isUploading"
        novalidate
        @submit.prevent="onSubmit"
      >
        <fieldset :disabled="isUploading" class="flex flex-col gap-6 md:gap-8">
          <legend class="sr-only">Dataset details</legend>

          <div class="flex flex-col gap-2">
            <label for="csv-file" class="text-base font-medium text-ink md:text-lg">CSV file</label>
            <input
              id="csv-file"
              type="file"
              name="file"
              accept=".csv,text/csv"
              required
              aria-describedby="csv-file-hint"
              class="block w-full cursor-pointer rounded-lg border border-line bg-canvas text-sm text-ink-muted file:mr-4 file:cursor-pointer file:border-0 file:bg-primary-soft file:px-4 file:py-2.5 file:font-medium file:text-primary hover:file:bg-subtle md:text-base"
              @change="onFileChange"
            />
            <p id="csv-file-hint" class="text-sm text-ink-muted">
              <template v-if="file">{{ file.name }} · {{ fileSize }}</template>
              <template v-else>
                One row per company, with a header row. Needs a company name column and at least
                one numeric column such as funding or revenue. Max 2 MB.
              </template>
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label for="category" class="text-base font-medium text-ink md:text-lg">Industry</label>
            <input
              id="category"
              v-model="category"
              type="text"
              name="category"
              required
              maxlength="40"
              placeholder="e.g. Fintech"
              autocomplete="off"
              aria-describedby="category-hint"
              class="rounded-lg border border-line bg-canvas px-3 py-2.5 text-base text-ink placeholder:text-ink-muted/60"
            />
            <p id="category-hint" class="text-sm text-ink-muted">
              Used in the blog title and URL, for example “Top 100 UK Fintech companies”.
            </p>
          </div>
        </fieldset>

        <p
          v-if="status === 'error'"
          role="alert"
          class="rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger md:text-base"
        >
          {{ errorMessage }}
        </p>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button type="submit" class="btn-primary md:px-6 md:py-3 md:text-base" :disabled="isUploading">
            <AppSpinner v-if="isUploading" />
            {{ isUploading ? 'Generating blog…' : 'Generate blog' }}
          </button>
          <p role="status" class="text-sm text-ink-muted md:text-base">
            <template v-if="isUploading">
              Parsing the CSV and writing the article. This can take up to 30 seconds.
            </template>
          </p>
        </div>
      </form>
    </div>
  </main>
</template>
