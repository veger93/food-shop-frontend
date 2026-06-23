import { createContext, useContext, useState } from 'react'

// Создаём контекст — это как объявление "глобальной переменной"
// для всего дерева компонентов
const AuthContext = createContext(null)

// AuthProvider — компонент-обёртка который предоставляет данные
// всем вложенным компонентам
export function AuthProvider({ children }) {

    // user хранит данные залогиненного пользователя
    // Пытаемся восстановить из localStorage при старте страницы
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    // Вызывается после успешного логина
    // userData — объект { username, email, role, token }
    const login = (userData) => {
        setUser(userData)
        // Сохраняем в localStorage чтобы не терять после перезагрузки страницы
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userData.token)
    }

    // Вызывается при выходе из аккаунта
    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    // value — всё что будет доступно из любого компонента
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Хук для удобного использования контекста
// Вместо useContext(AuthContext) в каждом компоненте пишем просто useAuth()
export function useAuth() {
    return useContext(AuthContext)
}