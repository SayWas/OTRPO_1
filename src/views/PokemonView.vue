<template>
  <div class="pokemon">
    <div class="pokemon-info">
      <div class="pokemon-info-image">
        <img v-if="pokemon.sprites !== undefined" :src="pokemon.sprites.front_default" :alt="pokemon.name"/>
      </div>
      <div class="pokemon-info-name">
        {{ pokemon.name }}
      </div>
      <div class="pokemon-stats" v-if="pokemon.stats[0] != undefined">
        <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="pokemon-stat">
          <div class="pokemon-stat-name">{{ stat.stat.name }}</div>
          <div class="pokemon-stat-value">{{ stat.base_stat }}</div>
        </div>
      </div>
    </div>
    <div class="pokemon-actions">
      <button
          @click="selectPokemon"
          class="action-button choose-button">
        I Choose you!
      </button>
      <button
          v-if="fightStore.user_pokemon !== undefined"
          @click="startFight"
          class="action-button fight-button">
        Let's fight!
      </button>
      <button
          v-if="fightStore.user_pokemon !== undefined"
          @click="autoFight"
          class="action-button auto-fight-button">
        Auto fight!
      </button>
    </div>
    <div v-if="userStore.currentUser?.role.permissions?.CAN_USE_FTP" class="ftp-form">
      <input 
        type="text" 
        v-model="ftpLogin" 
        placeholder="FTP Login" />
      <input 
        type="password" 
        v-model="ftpPassword" 
        placeholder="FTP Password" />
      <button @click="savePokemon">CATCH!!!</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { pokemonSchema } from "@/api/pokemon-api";
import {usePokemonStore} from "@/stores/pokemon";
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useFightStore} from "@/stores/fight";
import router from "@/router";
import {useUserStore} from "@/stores/user";

const route = useRoute();
const pokemonStore = usePokemonStore();
const pokemon = ref<pokemonSchema>({
  name: '',
    sprites: {
        front_default: ''
    },
    stats: [{
        base_stat: 0,
        stat: {
            name: ''
        }
    }],
    types: [{
        type: {
            name: ''
        }
    }],
    weight: 0,
    height: 0,
    abilities: [{
        ability: {
            name: ''
        }
    }]
})

const fightStore = useFightStore();
const selectPokemon = () => {
  fightStore.selectPokemon(pokemon.value);
  router.push('/');
}
const startFight = () => {
  fightStore.selectOpponent(pokemon.value);
  router.push('/fight');
}
const autoFight = () => {
  fightStore.selectOpponent(pokemon.value);
  router.push('/fight?auto=true');
}

const userStore = useUserStore();

const ftpLogin = ref('');
const ftpPassword = ref('');

const savePokemon = () => {
  pokemonStore.savePokemon(pokemon.value, ftpLogin.value, ftpPassword.value);
}

onMounted(async () => {
  const name = route.params.name;
  if (typeof name !== 'string') {
    console.error('Invalid name type');
    return;
  }

  await pokemonStore.getPokemon(name).then((response) => {
    if (response !== undefined) {
      pokemon.value = response;
    }
  });
})
</script>

<style scoped lang="scss">
.pokemon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .pokemon-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    margin-bottom: 30px;
    border: 1px solid #d5d5d5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }

    .pokemon-info-image {
      width: 200px;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .pokemon-info-name {
      font-size: 20px;
      font-weight: 500;
      margin-top: 10px;
      color: #4a4a4a;
    }

    .pokemon-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 20px;

      .pokemon-stat {
        display: flex;
        justify-content: space-between;
        width: 200px;
        margin-bottom: 10px;

        .pokemon-stat-name {
          font-size: 16px;
          font-weight: 500;
          color: #4a4a4a;
        }

        .pokemon-stat-value {
          font-size: 16px;
          font-weight: 500;
          color: #4a4a4a;
        }
      }
    }
  }

  .ftp-form {
    display: flex;
    flex-direction: column;
    gap: 10px;

    input {
      width: 200px;
      height: 40px;
      padding: 0 10px;
      border-radius: 20px;
      border: 1px solid #d5d5d5;
      outline: none;
    }

    button {
      width: 200px;
      height: 40px;
      border-radius: 20px;
      border: none;
      background-color: #4caf50;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #45a049;
      }
    }
  }

  .pokemon-actions {
    display: flex;
    flex-direction: column;

    .action-button {
      width: 200px;
      height: 40px;
      margin-bottom: 10px;
      border-radius: 40px;
      outline: none;
      border: 1px solid #d5d5d5;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &.choose-button {
        background-color: #ffcc00;
        color: #333;
      }

      &.fight-button {
        background-color: #cc0000;
        color: #fff;
      }

      &.auto-fight-button {
        background-color: #00cc66;
        color: #fff;
      }

      &:hover {
        background-color: #d5d5d5;
      }
    }
  }
}
</style>