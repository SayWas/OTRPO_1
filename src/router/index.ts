import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PokemonView from "@/views/PokemonView.vue";
import FightView from "@/views/FightView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import AuthCallBackView from "@/views/AuthCallBackView.vue";
import ForgotPasswordView from "@/views/ForgotPasswordView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import {useFightStore} from "@/stores/fight";
import {useUserStore} from "@/stores/user";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/pokemon/:name',
            name: 'pokemon',
            component: PokemonView
        },
        {
            path: '/fight',
            name: 'fight',
            component: FightView,
            beforeEnter: (to, from, next) => {
                const fightStore = useFightStore();
                if (fightStore.user_pokemon && fightStore.opponent_pokemon) {
                    next();
                } else {
                    next({name: 'home'});
                }
            }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/auth/callback',
            name: 'AuthCallback',
            component: AuthCallBackView
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: ForgotPasswordView
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: ResetPasswordView
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    if (!userStore.isSessionChecked) {
        await userStore.checkSession(); // Wait for session check to complete
    }
    const isUserLoggedIn = userStore.currentUser;

    if ((to.name === 'login' || to.name === 'reset-password' || to.name === 'forgot-password' || to.name === 'register') && isUserLoggedIn) {
        // Redirect to home page if the user is already logged in and tries to access the login page
        next({name: 'home'});
    } else if ((to.name === 'reset-password' || to.name === 'forgot-password') && !isUserLoggedIn) {
        // Allow access to reset and forgot password routes only if the user is not logged in
        next();
    } else if (to.meta.requiresAuth && !isUserLoggedIn) {
        // Redirect to login page if the route requires auth and the user is not logged in
        next({name: 'login'});
    } else {
        // Otherwise, allow the navigation
        next();
    }
});

export default router
