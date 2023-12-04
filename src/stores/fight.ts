import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {pokemonSchema} from "@/api/pokemon-api";
import {PokemonAPI} from "@/api/pokemon-api";

export const useFightStore = defineStore('fight', () => {
    const user_pokemon = ref<pokemonSchema | undefined>(undefined)
    const opponent_pokemon = ref<pokemonSchema | undefined>(undefined)
    const someoneIsAlive = ref<boolean>(true)
    const fight_logs = ref<string[]>([])
    const winner_id = ref<string>('')
    const loser_id = ref<string>('')
    const total_rounds = ref<number>(0)

    const selectPokemon = async (pokemon: pokemonSchema) => {
        user_pokemon.value = pokemon
    }

    const selectOpponent = async (pokemon: pokemonSchema) => {
        opponent_pokemon.value = pokemon
    }

    const attack = async (user_number: number | undefined = 0): Promise<string> => {
        const turn: boolean = user_number !== undefined && user_number % 2 === Math.floor(Math.random() * 2) % 2
        total_rounds.value++

        if (turn) {
            if (user_pokemon.value?.stats[1].base_stat !== undefined && opponent_pokemon.value?.stats[0].base_stat !== undefined) {
                const defenseScale = user_pokemon.value.stats[1].base_stat < opponent_pokemon.value.stats[0].base_stat ? 1 - (user_pokemon.value.stats[1].base_stat / opponent_pokemon.value.stats[0].base_stat) : 0.5
                const damage = Math.round((user_pokemon.value?.stats[1].base_stat as number * defenseScale))
                opponent_pokemon.value.stats[0].base_stat -= damage
                if (opponent_pokemon.value.stats[0].base_stat <= 0) {
                    opponent_pokemon.value.stats[0].base_stat = 0
                    fight_logs.value.push(`${user_pokemon.value.name} нанес удар ${opponent_pokemon.value.name} на ${damage.toString()}. ${opponent_pokemon.value.name} побежден!`)
                    someoneIsAlive.value = false
                    winner_id.value = user_pokemon.value.id.toString()
                    loser_id.value = opponent_pokemon.value.id.toString()
                    await addToDataBase()
                    return fight_logs.value[fight_logs.value.length - 1]
                }
                fight_logs.value.push(`${user_pokemon.value.name} нанес удар ${opponent_pokemon.value.name} на ${damage.toString()}`)
                return fight_logs.value[fight_logs.value.length - 1]
            }
        } else {
            if (opponent_pokemon.value?.stats[1].base_stat !== undefined && user_pokemon.value?.stats[0].base_stat !== undefined) {
                const defenseScale = opponent_pokemon.value.stats[1].base_stat < user_pokemon.value.stats[0].base_stat ? 1 - (opponent_pokemon.value.stats[1].base_stat / user_pokemon.value.stats[0].base_stat) : 0.5
                const damage = Math.round((opponent_pokemon.value?.stats[1].base_stat as number * defenseScale))
                user_pokemon.value.stats[0].base_stat -= damage
                if (user_pokemon.value.stats[0].base_stat <= 0) {
                    user_pokemon.value.stats[0].base_stat = 0
                    fight_logs.value.push(`${opponent_pokemon.value.name} нанес удар ${user_pokemon.value.name} на ${damage.toString()}. ${user_pokemon.value.name} побежден!`)
                    someoneIsAlive.value = false
                    winner_id.value = opponent_pokemon.value.id.toString()
                    loser_id.value = user_pokemon.value.id.toString()
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
        // const logs = fight_logs.value.join('\n')
        await PokemonAPI.addToDataBase(winner_id.value, loser_id.value, total_rounds.value).then(r => {
            console.log(r)
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    const reset_fight = () => {
        user_pokemon.value = undefined
        opponent_pokemon.value = undefined
        someoneIsAlive.value = true
        fight_logs.value = []
        winner_id.value = ''
        loser_id.value = ''
        total_rounds.value = 0
    }

    return {user_pokemon, opponent_pokemon, someoneIsAlive, selectPokemon, selectOpponent, attack, fight_logs, sendLogsToMail, reset_fight}
})