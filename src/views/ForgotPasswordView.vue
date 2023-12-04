<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h1 class="forgot-password-title">Восстановление пароля</h1>
      <p v-if="message" class="message">{{ message }}</p>
      <form @submit.prevent="submitForgotPassword" class="forgot-password-form">
        <div class="input-wrapper">
          <input type="email" v-model="email" placeholder="Ваш email" required autofocus>
        </div>
        <button type="submit" class="forgot-password-button">Сбросить пароль</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useUserStore} from '@/stores/user';

const userStore = useUserStore();
const email = ref('');
const message = ref(''); // Сообщение об отправке

const submitForgotPassword = async () => {
  try {
    await userStore.forgotPassword(email.value);
    message.value = 'Инструкции по сбросу пароля отправлены на вашу электронную почту.';
    email.value = '';
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    message.value = 'Ошибка при отправке инструкций. Попробуйте ещё раз.';
  }
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6;
}

.forgot-password-card {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.forgot-password-title {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.input-wrapper {
  margin-bottom: 1.5rem;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.forgot-password-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #4b5563;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}

.forgot-password-button:hover {
  background: #374151;
}

.message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #e5e7eb;
  color: #111827;
  text-align: center;
}
</style>
