<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <NuxtLink to="/products/new/edit"><div /></NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
navigateTo('/products/new/edit')
</script>
