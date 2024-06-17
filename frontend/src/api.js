import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const apiUrl = "/c20db853-21fe-4f11-b230-00ff84048af0-dev.e1-us-east-azure.choreoapis.dev/djangoreact/backend/v1.0"

const api = axios.create({
    // allows us to import anything from the env file
    // basically links react to the backend server
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
