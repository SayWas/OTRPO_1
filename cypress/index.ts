export interface PokemonData {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: {
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
        slot: number;
    }[];
    forms: {
        name: string;
        url: string;
    }[];
    species: {
        name: string;
        url: string;
    };
    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }[];
    types: {
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }[];
    sprites: {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
    };
}
