<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Вход в систему</h1>
      <form @submit.prevent="submitLogin" class="login-form">
        <div class="input-wrapper">
          <input type="text" id="username" v-model="credentials.username" placeholder="Имя пользователя" required>
        </div>
        <div class="input-wrapper">
          <input type="password" id="password" v-model="credentials.password" placeholder="Пароль" required>
        </div>
        <button type="submit" class="login-button">Войти</button>
      </form>
      <button @click="loginWithGoogle" class="google-login-button">
        <img src="https://www.svgrepo.com/show/380993/google-logo-search-new.svg" alt="Google login" class="google-logo" />
        Войти с Google
      </button>
      <RouterLink to="forgot-password" class="forgot-password-link">Забыли пароль?</RouterLink>
      <router-link to="/register" class="register-link">Зарегистрироваться</router-link>
    </div>
    <div v-if="showOTPModal" class="otp-modal">
      <div class="otp-modal-content">
        <h3>Введите код из вашей почты</h3>
        <input type="text" placeholder="Код подтверждения" v-model="otpCode">
        <button @click="submitOTPCode" class="verify-button">Подтвердить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const credentials = ref({ username: '', password: '' });
const otpCode = ref('');
const showOTPModal = ref(false);

const submitLogin = async () => {
  try {
    await userStore.login(credentials.value);

    showOTPModal.value = true;
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};

const loginWithGoogle = async () => {
  try {
    window.location.href = await userStore.fetchOAuthUrl();
  } catch (error) {
    console.error('Ошибка входа через Google:', error);
  }
};

const submitOTPCode = async () => {
  try {
    await userStore.verifyOTP({username: credentials.value.username, password: credentials.value.password, otp: otpCode.value});
    showOTPModal.value = false;
    await router.push('/');
  } catch (error) {
    console.error('Ошибка подтверждения OTP:', error);
  }
};

const closeOTPModal = () => {
  showOTPModal.value = false;
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6; /* Светлый фон всей страницы */
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 340px;
}

.login-title {
  color: #5c5c5c;
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
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #4b5563; /* Темно-серый цвет */
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
}

.login-button:hover {
  background: #374151; /* Чуть более темный оттенок при наведении */
}

.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
}

.google-logo {
  width: 24px; /* Размер лого Google */
}

.register-link {
  display: block;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
}

.register-link:hover {
  text-decoration: underline;
}

.otp-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.otp-modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 300px;
}

.otp-modal-content h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.otp-modal-content input {
  width: calc(100% - 20px); /* Вычитаем padding */
  padding: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* Убедитесь, что padding включен в ширину */
}

.verify-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  color: white;
  background: #5c5c5c; /* Темно-серый цвет кнопки */
  cursor: pointer;
  box-sizing: border-box; /* Убедитесь, что padding включен в ширину */
}

.verify-button:hover {
  background: #424242;
}

.forgot-password-link {
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
  margin-top: 0.5rem;
  text-decoration: none;
  cursor: pointer;
}

.forgot-password-link:hover {
  text-decoration: underline;
  color: #4b5563;
}
</style>
