<template>
  <div class="registration-container">
    <div class="registration-card">
      <h1 class="registration-title">Регистрация</h1>
      <form @submit.prevent="submitRegistration" class="registration-form">
        <div class="input-wrapper">
          <input type="email" id="email" v-model="credentials.email" placeholder="Email" required>
        </div>
        <div class="input-wrapper">
          <input type="password" id="password" v-model="credentials.password" placeholder="Пароль" required>
        </div>
        <div class="input-wrapper">
          <input type="password" id="password-confirm" v-model="passwordConfirm" placeholder="Подтвердите пароль" required>
        </div>
        <button type="submit" class="registration-button">Зарегистрироваться</button>
      </form>
      <router-link to="/login" class="login-link">Уже есть аккаунт? Войти</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const credentials = ref({ email: '', password: '' });
const passwordConfirm = ref('');

const submitRegistration = async () => {
  if (credentials.value.password !== passwordConfirm.value) {
    alert("Пароли не совпадают!");
    return;
  }

  try {
    await userStore.registerUser(credentials.value);
    await router.push('/login');
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
};
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6;
}

.registration-card {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 340px;
}

.registration-title {
  color: #333;
  margin-bottom: 2rem;
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
  color: #333;
  background-color: #f9fafb;
}

.registration-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #10b981;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
}

.registration-button:hover {
  background-color: #059669;
}

.login-link {
  display: block;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
