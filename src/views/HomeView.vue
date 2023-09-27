<template>
  <div class="search_bar">
    <input class="search_input" type="text" placeholder="Search" v-model="prompt"/>
    <button @click="searchPokemon" class="button button-search">Search</button>
  </div>
  <div class="pokemon-view">
    <span v-for="pokemon in pokemons">{{ pokemon.name }}</span>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {PokemonAPI} from "@/api/pokemon-api";

const prompt = ref<string>("")
const pokemons = ref<any[]>([{name: "Не найдено"}])

const searchPokemon = async () => {
  if (prompt.value === "") {
    PokemonAPI.getAllPokemons().then(
        (response) => {
          pokemons.value = response;
        }
    )
    return;
  }
  await PokemonAPI.getPokemon(prompt.value).then(
    (response) => {
      pokemons.value = response;
    }
  ).catch(
    () => {
      pokemons.value = [{name: "Не найдено"}];
    }
  )
}

onMounted(() => {
  PokemonAPI.getAllPokemons().then(
    (response) => {
      pokemons.value = response;
    }
  )
})
</script>

<style scoped lang="scss">
.search_bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;

  .search_input {
    width: 50%;
    height: 40px;
    border-radius: 40px;
    outline: none;
    border: 1px solid #d5d5d5;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    transition: all 0.3s ease;

    &:focus {
      border: 1px solid #333;
    }
  }
  .button {
    width: 100px;
    height: 40px;
    border-radius: 40px;
    outline: none;
    border: none;
    background-color: #333;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #fff;
      color: #333;
      border: 1px solid #333;
    }
  }
  .button-search {
    margin-left: 10px;
  }
}
.pokemon-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  color: #181818;
}
</style>