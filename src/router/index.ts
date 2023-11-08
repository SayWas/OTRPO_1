import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PokemonView from "@/views/PokemonView.vue";
import FightView from "@/views/FightView.vue";

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
          component: FightView
      }
  ]
})

export default router
