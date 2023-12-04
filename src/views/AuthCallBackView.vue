<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import {onMounted} from "vue";

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  const code = router.currentRoute.value.query.code;
  const state = router.currentRoute.value.query.state;

  if (code && state) {
    try {
      if (typeof code === "string" && typeof state === "string") {{
          await userStore.handleOAuthCallback(code, state);
        }
      }
    } catch (error) {
      console.error('Ошибка обработки OAuth коллбэка:', error);
    }
    finally {
      await router.replace('/');
    }
  }
});
</script>

<template>

</template>

<style scoped>

</style>