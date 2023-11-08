import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {pokemonSchema} from "@/api/pokemon-api";
import {PokemonAPI} from "@/api/pokemon-api";

export const useFightStore = defineStore('fight', () => {
    const user_pokemon = ref<pokemonSchema | undefined>(undefined)
    const opponent_pokemon = ref<pokemonSchema | undefined>(undefined)
    const someoneIsAlive = ref<boolean>(true)
    const fight_logs = ref<string[]>([])

    const selectPokemon = async (pokemon: pokemonSchema) => {
        user_pokemon.value = pokemon
    }

    const selectOpponent = async (pokemon: pokemonSchema) => {
        opponent_pokemon.value = pokemon
    }

    const attack = async (user_number: number | undefined = 0): Promise<string> => {
        const turn: boolean = user_number !== undefined && user_number % 2 === Math.floor(Math.random() * 2) % 2

        if (turn){
            if (user_pokemon.value?.stats[1].base_stat !== undefined && opponent_pokemon.value?.stats[0].base_stat !== undefined) {
                const defenseScale = user_pokemon.value.stats[1].base_stat < opponent_pokemon.value.stats[0].base_stat ? 1 - (user_pokemon.value.stats[1].base_stat / opponent_pokemon.value.stats[0].base_stat) : 0.5
                const damage = Math.round((user_pokemon.value?.stats[1].base_stat as number * defenseScale))
                opponent_pokemon.value.stats[0].base_stat -= damage
                if (opponent_pokemon.value.stats[0].base_stat <= 0) {
                    opponent_pokemon.value.stats[0].base_stat = 0
                    fight_logs.value.push(`${user_pokemon.value.name} нанес удар ${opponent_pokemon.value.name} на ${damage.toString()}. ${opponent_pokemon.value.name} побежден!`)
                    someoneIsAlive.value = false
                    await addToDataBase()
                    return fight_logs.value[fight_logs.value.length - 1]
                }
                fight_logs.value.push(`${user_pokemon.value.name} нанес удар ${opponent_pokemon.value.name} на ${damage.toString()}`)
                return fight_logs.value[fight_logs.value.length - 1]
            }
        }
        else{
            if (opponent_pokemon.value?.stats[1].base_stat !== undefined && user_pokemon.value?.stats[0].base_stat !== undefined) {
                const defenseScale = opponent_pokemon.value.stats[1].base_stat < user_pokemon.value.stats[0].base_stat ? 1 - (opponent_pokemon.value.stats[1].base_stat / user_pokemon.value.stats[0].base_stat) : 0.5
                const damage = Math.round((opponent_pokemon.value?.stats[1].base_stat as number * defenseScale))
                user_pokemon.value.stats[0].base_stat -= damage
                if (user_pokemon.value.stats[0].base_stat <= 0) {
                    user_pokemon.value.stats[0].base_stat = 0
                    fight_logs.value.push(`${opponent_pokemon.value.name} нанес удар ${user_pokemon.value.name} на ${damage.toString()}. ${user_pokemon.value.name} побежден!`)
                    someoneIsAlive.value = false
                    await addToDataBase()
                    return fight_logs.value[fight_logs.value.length - 1]
                }
                fight_logs.value.push(`${opponent_pokemon.value.name} нанес удар ${user_pokemon.value.name} на ${damage.toString()}`)
                return fight_logs.value[fight_logs.value.length - 1]
            }
        }
        return ''
    }

    const sendLogsToMail = async (mail: string) => {
        const logs = fight_logs.value.join('\n')
        await PokemonAPI.sendLogsToMail(mail, logs).then(r => {
            console.log(r)
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    const addToDataBase = async () => {
        const logs = fight_logs.value.join('\n')
        await PokemonAPI.addToDataBase(logs).then(r => {
            console.log(r)
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    return {user_pokemon, opponent_pokemon, someoneIsAlive, selectPokemon, selectOpponent, attack, fight_logs, sendLogsToMail}
})