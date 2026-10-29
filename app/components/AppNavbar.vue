<script setup lang="ts">
const links = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Upload', to: '/upload' },
]

const menuOpen = ref(false)
const route = useRoute()

// Home only matches "/", other links also match their child pages (e.g. /blog/...)
function isActive(to: string) {
  return route.path === to || (to !== '/' && route.path.startsWith(`${to}/`))
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-20 w-full bg-canvas">
    <nav
      class="flex h-16 w-full items-center justify-between px-6 md:h-20 md:px-8 lg:px-16 xl:px-37.5"
    >
      <NuxtLink
        to="/"
        class="font-display text-xl font-bold text-ink hover:no-underline sm:text-2xl lg:text-[1.75rem] xl:text-[clamp(2rem,2.5vw,2.3rem)]"
      >
        Blog Generator
      </NuxtLink>

      <ul class="hidden items-center gap-2 md:flex lg:gap-3">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            :aria-current="isActive(link.to) ? 'page' : undefined"
            class="rounded-full px-3 py-1.5 text-sm hover:no-underline md:text-base lg:px-4 lg:py-2 lg:text-lg xl:text-xl"
            :class="
              isActive(link.to)
                ? 'bg-primary-soft font-semibold text-primary'
                : 'font-medium text-ink-muted hover:bg-subtle hover:text-ink'
            "
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <button
        type="button"
        class="rounded-lg p-2 text-ink-muted hover:bg-subtle hover:text-ink md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
        <svg
          v-if="!menuOpen"
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>

    <!-- mobile dropdown -->
    <ul
      v-show="menuOpen"
      id="mobile-menu"
      class="space-y-1 px-6 pb-3 left-0 top-full w-full absolute z-20 bg-canvas md:hidden"
    >
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="inline-block rounded-lg px-3 py-2 text-lg hover:no-underline sm:px-4 sm:py-2.5 sm:text-xl"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          :class="
            isActive(link.to)
              ? 'bg-primary-soft font-semibold text-primary'
              : 'font-medium text-ink-muted hover:bg-subtle hover:text-ink'
          "
        >
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </header>
</template>
