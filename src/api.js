import axios from "axios"

const isDevelopment = import.meta.env.MODE === 'development'

const api = axios.create({
    baseURL : isDevelopment ? import.meta.env.VITE_API_URL : import.meta.VITE_API_BASE_URL_DEPLOY,
})

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('accessToken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
    
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refresh = localStorage.getItem('refreshToken')

                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh/`,
                    { refresh }
                )

                localStorage.setItem('accessToken', res.data.access)

                originalRequest.headers.Authorization = `Bearer ${res.data.access}`
                return api(originalRequest)

            } catch (err) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = "/login"
            }
        }

        return Promise.reject(error)
    }
)

export default api