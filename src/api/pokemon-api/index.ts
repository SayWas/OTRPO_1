import { DefaultAPIInstance } from '@/api'

export const PokemonAPI = {
    /**
     * @description Function
     * @returns Pokemon
     * @throws {Error} Request error message
     */
    async getPokemon(
        prompt: string
    ): Promise<string[]> {
        const url: string = '/pokemon/' + prompt
        let pokemon: string[] | undefined
        let errorMessage: string = ''

        await DefaultAPIInstance.get(url)
            .then(async (r): Promise<void> => {
                if (r.status === 200) {
                    console.log(r)
                    pokemon = [r.data]
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (pokemon) return pokemon
        throw new Error(errorMessage)
    },

    async getAllPokemons(): Promise<string[]> {
        const url: string = '/pokemon/?limit=1300'
        let pokemons: string[] | undefined
        let errorMessage: string = ''

        await DefaultAPIInstance.get(url)
            .then(async (r): Promise<void> => {
                if (r.status === 200) {
                    console.log(r)
                    pokemons = r.data.results
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (pokemons) return pokemons
        throw new Error(errorMessage)
    }
}