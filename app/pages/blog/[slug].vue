<template>
  <div>
    <h1>Post {{ slug }}</h1>
  </div>
</template>

<script setup lang="ts">
const { slug } = useRoute().params
</script>
