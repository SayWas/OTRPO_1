import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { pokemonSchema } from '@/api/pokemon-api'
import { PokemonAPI } from '@/api/pokemon-api'

export const usePokemonStore = defineStore('pokemon', () => {
  const page = ref(0)
  const pages = ref(0)
  const pokemons: Ref<pokemonsSchema> = ref({})

  watch(page, async () => {
    if (page.value === 0) return
    for (const pokemon of pokemons.value[page.value]) {
      if (!pokemon.sprites) {
        await PokemonAPI.getPokemon(pokemon.name).then((result) => {
          pokemons.value[page.value].splice(pokemons.value[page.value].indexOf(pokemon), 1, result)
        })
      }
    }
  })

  const getAllPokemons = async (): Promise<void> => {
    page.value = 0
    const results = await PokemonAPI.getAllPokemons()
    pages.value = Math.ceil(results.count / 49)
    page.value = 1
    for (let i = 1; i <= pages.value; i++) {
      pokemons.value[i] = results.results.slice((i - 1) * 49, i * 49)
    }
  }

  const getPokemon = async (name: string): Promise<pokemonSchema | undefined> => {
    try {
      const pokemon = await PokemonAPI.getPokemon(name)
      return pokemon
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  const searchPokemon = async (prompt: string) => {
    await PokemonAPI.getPokemon(prompt)
      .then((result) => {
        page.value = 1
        pages.value = 1
        pokemons.value = {
          1: [result]
        }
      })
      .catch(() => {
        page.value = 0
        pages.value = 0
        pokemons.value = {}
      })
  }

  const savePokemon = async (pokemon: pokemonSchema, ftpLogin: string, ftpPassword: string) => {
    await PokemonAPI.savePokemon(pokemon, ftpLogin, ftpPassword)
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return { page, pages, pokemons, getAllPokemons, getPokemon, searchPokemon, savePokemon }
})

interface pokemonsSchema {
  [page: number]: pokemonSchema[]
}
