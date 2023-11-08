<template>
<div class="pokemon-list-item">
  <RouterLink :to="'pokemon/' + pokemon.name" class="pokemon-list-item-image">
    <img v-if="pokemon.sprites !== undefined" :src="pokemon.sprites.front_default" :alt="pokemon.name" />
  </RouterLink>
  <div class="pokemon-list-item-name">
    {{ pokemon.name }}
  </div>
</div>
</template>

<script setup lang="ts">
import type {pokemonSchema} from "@/api/pokemon-api";
import type {PropType} from "vue";

const props = defineProps({
  pokemon: {
    type: Object as PropType<pokemonSchema>,
    required: true,
    default: () => ({
      name: "",
      sprites: {
        front_default: ""
      },
      types: []
    })
  }
})
</script>

<style scoped>
.pokemon-list-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 1px solid #d5d5d5;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
  &-name {
    font-size: 20px;
    font-weight: 500;
    margin-top: 10px;
  }
  &-image {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>