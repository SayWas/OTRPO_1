<template>
  <body>
  <PokeHeader/>
  <RouterView/>
  </body>
</template>

<script setup lang="ts">
import {RouterView} from 'vue-router'
import PokeHeader from "@/components/PokeHeader.vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
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
