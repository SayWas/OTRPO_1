<template>
  <header class="header">
    <router-link to="/" class="brand">Pokemon</router-link>
    <div v-if="userStore.currentUser || !userStore.isSessionChecked" class="user-info">
      <span class="user-email">
        {{ userStore.currentUser?.email }}
      </span>
      <button class="logout-button" @click="logout">Выйти</button>
    </div>
    <div v-else class="auth-buttons">
      <router-link to="/login" class="auth-button login-button">Войти</router-link>
      <router-link to="/register" class="auth-button register-button">Регистрация</router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useUserStore} from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const logout = async () => {
  await userStore.logout();
  await router.push('/');
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 80px; /* Увеличиваем высоту хедера */
}

.brand {
  font-size: 1.8rem; /* Увеличиваем размер шрифта для бренда */
  font-weight: bold;
  color: #5c5c5c; /* Вы можете выбрать любой цвет */
  text-decoration: none; /* Убираем подчеркивание ссылки */
}

.brand:hover {
  color: #333; /* Цвет при наведении */
}

.user-info {
  display: flex;
  align-items: center; /* Центрируем элементы по вертикали */
  font-size: 1rem;
  color: #5c5c5c;

  .user-email {
    margin-right: 1rem; /* Добавляем небольшой отступ справа */
  }
}

.logout-button {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  color: #ffffff;
  background-color: #e63946; /* Например, красный цвет */
  border: none;
  border-radius: 20px; /* Скругленные края */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Немного тени для глубины */
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover,
.logout-button:focus {
  background-color: #d62828; /* Немного темнее при наведении */
  outline: none; /* Убрать стандартный outline при фокусе */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Увеличить тень при наведении */
}

.auth-buttons {
  display: flex;
  align-items: center; /* Center items vertically */
}

.auth-button {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  margin-left: 1rem; /* Space between buttons */
  text-decoration: none; /* Remove link underline */
  border-radius: 20px; /* Rounded corners */
  transition: all 0.3s ease;
  cursor: pointer;
}

.login-button {
  background-color: #457b9d; /* For example, a shade of blue */
  color: #ffffff;
}

.login-button:hover,
.login-button:focus {
  background-color: #1d3557; /* Darker shade on hover */
}

.register-button {
  background-color: #f4a261; /* For example, a shade of orange */
  color: #ffffff;
}

.register-button:hover,
.register-button:focus {
  background-color: #e76f51; /* Darker shade on hover */
}
</style>
