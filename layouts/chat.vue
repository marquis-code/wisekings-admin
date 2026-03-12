<template>
  <div class="h-screen w-screen bg-[#f0f2f5] flex flex-col overflow-hidden">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Minimal chat layout to allow full-screen experience
</script>

<style>
/* Reset some default dashboard styles if any */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
