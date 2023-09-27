<template>
  <body>
    <RouterView/>
  </body>
</template>

<script setup lang="ts">
import {RouterView} from 'vue-router'
</script>

<style scoped>
body {
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
