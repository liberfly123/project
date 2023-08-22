<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <Suspense>
    <template #default>
      <RouterView />
    </template>
  </Suspense>
</template>

<style scoped></style>
