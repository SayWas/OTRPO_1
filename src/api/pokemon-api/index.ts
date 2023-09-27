import { DefaultAPIInstance } from '@/api'

export const PokemonAPI = {
    /**
     * @description Function that makes get library preview request to the server
     * @returns Pokemon
     * @throws {Error} Request error message
     */
    async getPokemon(
        prompt: string
    ): Promise<string> {
        const url: string = '/pokemon/' + prompt
        let pokemon: string | undefined
        let errorMessage: string = ''

        await DefaultAPIInstance.get(url)
            .then(async (r): Promise<void> => {
                if (r.status === 200) {
                    console.log(r)
                    pokemon = r.data.name
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (pokemon) return pokemon
        throw new Error(errorMessage)
    }
}