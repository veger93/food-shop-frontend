import axios from 'axios'

// Базовый адрес нашего api-gateway
const api = axios.create({
    baseURL: 'http://localhost:8080',
})

// Интерсептор — добавляет токен авторизации к каждому запросу автоматически
// Похоже на наш JwtInterceptor на backend, только здесь он добавляет
// токен ИЗ браузера В запрос, а не проверяет его
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api