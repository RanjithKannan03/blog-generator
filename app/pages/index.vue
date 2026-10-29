<script setup lang="ts">
useSeoMeta({
  title: "Blog Generator",
  description: "Turn company datasets into SEO-optimised blog posts.",
});
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-3xl font-bold text-slate-900">Blog Generator</h1>
    <p class="mt-2 text-slate-600">
      Upload a company CSV to generate an SEO-optimised blog post.
    </p>

    <section class="mt-10">
      <h2 class="text-xl font-semibold text-slate-900">Published blogs</h2>

      <p class="mt-4 text-slate-500">No blogs yet.</p>
    </section>
  </main>
</template>
