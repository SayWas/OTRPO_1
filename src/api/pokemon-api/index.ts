import {DefaultAPIInstance} from '@/api'

export const PokemonAPI = {
    /**
     * @description Function
     * @returns Pokemon
     * @throws {Error} Request error message
     */
    async getPokemon(
        prompt: string
    ): Promise<pokemonSchema> {
        const url: string = '/pokemon/' + prompt
        let pokemon: pokemonSchema | undefined
        let errorMessage: string = ''

        await DefaultAPIInstance.get(url)
            .then(async (r): Promise<void> => {
                if (r.status === 200) {
                    console.log(r)
                    pokemon = r.data
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (pokemon) return pokemon
        throw new Error(errorMessage)
    },

    async getAllPokemons(): Promise<pokemonResponseSchema> {
        const url: string = '/pokemons/?limit=1300'
        let response: pokemonResponseSchema | undefined
        let errorMessage: string = ''

        await DefaultAPIInstance.get(url)
            .then(async (r): Promise<void> => {
                if (r.status === 200) {
                    console.log(r)
                    response = r.data
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (response) return response
        throw new Error(errorMessage)
    },

    async sendLogsToMail(
        mail: string,
        logs: string): Promise<string>
    {
        const url: string = '/send_mail'
        let response: string | undefined
        let errorMessage: string = ''

        await DefaultAPIInstance.post(url, null,{ params: {
                mail: mail,
                logs: logs
            }})
            .then(async (r): Promise<void> => {
                if (r.status === 200) {
                    console.log(r)
                    response = r.data
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (response) return response
        throw new Error(errorMessage)

    },

    async addToDataBase(
        text: string
    ): Promise<string>
    {
        const url: string = '/add_to_db'
        let response: string | undefined
        let errorMessage: string = ''

        console.log(text)
        await DefaultAPIInstance.post(url, null,{ params: {
                text: text
            }})
            .then(async (r): Promise<void> => {
                if (r.status === 201) {
                    console.log(r)
                    response = r.data
                }
            })
            .catch((error) => (errorMessage = error.message))

        if (response) return response
        throw new Error(errorMessage)
    },

    async savePokemon(
        pokemon: pokemonSchema,
        ftpLogin: string,
        ftpPassword: string
    ): Promise<string> {
        const url: string = '/save_pokemon';
        let response: string | undefined;
        let errorMessage: string = '';

        console.log(pokemon);
        console.log(ftpLogin, ftpPassword);

        const auth = {
            username: ftpLogin,
            password: ftpPassword,
        };

        await DefaultAPIInstance.post(url, pokemon, { auth })
            .then(async (r): Promise<void> => {
                if (r.status === 201) {
                    console.log(r);
                    response = r.data;
                }
            })
            .catch((error) => (errorMessage = error.message));

        if (response) return response;
        throw new Error(errorMessage);
    }
}

interface pokemonResponseSchema {
    count: number
    next: string | null
    previous: string | null
    results: pokemonSchema[]
}

interface pokemonSchema {
    name: string
    sprites: {
        front_default: string
    }
    stats: {
        base_stat: number
        stat: {
            name: string
        }
    }[],
    types: {
        type: {
            name: string
        }
    }[],
    weight: number,
    height: number,
    abilities: {
        ability: {
            name: string
        }
    }[]
}

export type {pokemonSchema, pokemonResponseSchema};