import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user' // Adjust the path to your user store

const app = createApp(App)
const pinia = createPinia()

// Add a middleware to Pinia to check the session when the user store is accessed
pinia.use(async ({store}) => {
    if (store.$id === 'user') {
        const userStore = useUserStore();
        await userStore.checkSession();
    }
});

app.use(pinia)
app.use(router)

app.mount('#app')