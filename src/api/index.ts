import axios from 'axios'

const loginConfig = {
    baseURL: 'https://pokeapi.co/api/v2/',
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
}

export const LoginAPIInstance = axios.create(loginConfig)

const defaultConfig = {
    baseURL: 'https://pokeapi.co/api/v2/',
    headers:{
        'Content-Type': 'application/json'
    }
}

export const DefaultAPIInstance = axios.create(defaultConfig)

// DefaultAPIInstance.interceptors.response.use((response) => response, (error) => {
//     if (error.response.status === 401) {
//         router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } }).then(r => {})
//     }
// });
