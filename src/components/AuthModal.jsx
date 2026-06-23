import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function AuthModal({ onClose }) {
    // Переключатель между формой логина и регистрации
    const [mode, setMode] = useState('login')

    // Поля формы
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Ошибка от сервера или валидации
    const [error, setError] = useState('')

    // Флаг ожидания ответа от сервера
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()

    const handleSubmit = async () => {
        // Простая валидация перед отправкой
        if (!email || !password) {
            setError('Заполните все обязательные поля')
            return
        }
        if (mode === 'register' && !username) {
            setError('Введите имя пользователя')
            return
        }

        setError('')
        setLoading(true)

        try {
            if (mode === 'login') {
                // Запрос на логин
                const response = await api.post('/api/auth/login', { email, password })

                // Сохраняем пользователя через контекст
                login({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role,
                    token: response.data.token,
                })

                onClose()

            } else {
                // Запрос на регистрацию
                await api.post('/api/auth/register', { username, email, password })

                // После успешной регистрации сразу логиним пользователя
                const loginResponse = await api.post('/api/auth/login', { email, password })

                login({
                    username: loginResponse.data.username,
                    email: loginResponse.data.email,
                    role: loginResponse.data.role,
                    token: loginResponse.data.token,
                })

                onClose()
            }
        } catch (err) {
            // Показываем ошибку от сервера если она есть
            setError(err.response?.data?.message || 'Что-то пошло не так')
        } finally {
            setLoading(false)
        }
    }

    return (
        // Тёмный полупрозрачный фон поверх всей страницы
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            {/* Само окно */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm mx-4">

                {/* Заголовок и кнопка закрытия */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-white text-lg font-medium">
                        {mode === 'login' ? 'Вход' : 'Регистрация'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Переключатель Вход / Регистрация */}
                <div className="flex bg-gray-800 rounded-lg p-1 mb-5">
                    <button
                        onClick={() => { setMode('login'); setError('') }}
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors
              ${mode === 'login'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white'}`}
                    >
                        Войти
                    </button>
                    <button
                        onClick={() => { setMode('register'); setError('') }}
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors
              ${mode === 'register'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white'}`}
                    >
                        Регистрация
                    </button>
                </div>

                {/* Поле username — только для регистрации */}
                {mode === 'register' && (
                    <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-1 block">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ivan_petrov"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                    </div>
                )}

                {/* Email */}
                <div className="mb-3">
                    <label className="text-gray-400 text-sm mb-1 block">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ivan@mail.ru"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>

                {/* Пароль */}
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="минимум 6 символов"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>

                {/* Ошибка */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
                        {error}
                    </div>
                )}

                {/* Кнопка отправки */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </button>

            </div>
        </div>
    )
}

export default AuthModal