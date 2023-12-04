<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <h1 class="reset-password-title">Сброс пароля</h1>
      <p v-if="message" class="message">{{ message }}</p>
      <form @submit.prevent="submitResetPassword" class="reset-password-form">
        <div class="form-group">
          <input type="password" id="password" v-model="password" placeholder="Новый пароль" required>
        </div>
        <div class="form-group">
          <input type="password" id="passwordConfirmation" v-model="passwordConfirmation" placeholder="Подтвердите пароль" required>
        </div>
        <button type="submit" class="reset-password-button">Сбросить пароль</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const password = ref('');
const passwordConfirmation = ref('');
const message = ref('');
const token = router.currentRoute.value.params.token;

const submitResetPassword = async () => {
  if (password.value !== passwordConfirmation.value) {
    message.value = 'Пароли не совпадают.';
    return;
  }

  try {
    console.log(token);
    if (typeof token === "string") {
      await userStore.resetPassword(password.value, token);
    }
    message.value = 'Ваш пароль успешно сброшен. Вы будете перенаправлены на страницу входа.';
    setTimeout(() => router.push('/login'), 5000);
  } catch (error) {
    message.value = 'Ошибка сброса пароля. Пожалуйста, попробуйте снова.';
  }
};
</script>


<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6;
}

.reset-password-card {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.reset-password-title {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.reset-password-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #4b5563;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}

.reset-password-button:hover {
  background-color: #374151;
}

.message {
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: #d1e7dd;
  color: #0f5132;
  font-size: 16px;
  text-align: center;
}
</style>