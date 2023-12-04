import axios from 'axios'

const loginConfig = {
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
}

export const LoginAPIInstance = axios.create(loginConfig)

const defaultConfig = {
    baseURL: 'http://localhost:8000/',
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials: true
}

export const DefaultAPIInstance = axios.create(defaultConfig)

// DefaultAPIInstance.interceptors.response.use((response) => response, (error) => {
//     if (error.response.status === 401) {
//         router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } }).then(() => {})
//     }
// });
