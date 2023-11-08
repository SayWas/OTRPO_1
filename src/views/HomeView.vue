<template>
  <div class="search-bar">
    <input class="search-input" type="text" placeholder="Search" v-model="prompt"/>
    <button @click="searchPokemon" class="button button-search">Search</button>
  </div>
  <div class="pokemon-view">
    <PokemonListItem v-for="pokemon in pokemonStore.pokemons[pokemonStore.page]" :key="pokemon.name" :pokemon="pokemon"/>
<!--    <span v-for="pokemon in pokemonStore.pokemons[pokemonStore.page]">{{ pokemon.name }}</span>-->
    <span v-if="pokemonStore.pokemons[pokemonStore.page] === undefined">Покемон не найден</span>
  </div>
  <div class="pagination">
    <button
        v-for="page in pokemonStore.pages"
        @click="pokemonStore.page = page"
        :class="{'button': true, 'active': pokemonStore.page === page}"
        >
      {{ page }}
    </button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {usePokemonStore} from "@/stores/pokemon";
import PokemonListItem from "@/components/PokemonListItem.vue";

const prompt = ref<string>("")
const pokemonStore = usePokemonStore();

const searchPokemon = async () => {
  if (prompt.value === "") {
    await pokemonStore.getAllPokemons();
  } else {
    await pokemonStore.searchPokemon(prompt.value);
  }
}

onMounted(() => {
  pokemonStore.getAllPokemons();
})
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;

  .search-input {
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 30px 100px;
  color: #181818;
}

.pagination{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 50px;

  .button {
    width: 40px;
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

  .active {
    background-color: #fff;
    color: #333;
    border: 1px solid #333;
  }

  .button+button {
    margin-left: 10px;
  }
}
</style>