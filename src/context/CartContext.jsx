import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [totalItems, setTotalItems] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    // Загружаем корзину когда пользователь залогинился
    // useEffect с зависимостью [user] — перезапускается каждый раз
    // когда меняется объект user (залогинился или вышел)
    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            // Пользователь вышел — очищаем корзину в UI
            setCartItems([])
            setTotalItems(0)
            setTotalAmount(0)
        }
    }, [user])

    const fetchCart = async () => {
        try {
            setLoading(true)
            const response = await api.get('/api/orders/cart')
            setCartItems(response.data.items || [])
            setTotalItems(response.data.totalItems || 0)
            setTotalAmount(response.data.totalAmount || 0)
        } catch (err) {
            console.error('Ошибка загрузки корзины:', err)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = async (product) => {
        if (!user) return false // не залогинен — ничего не делаем

        try {
            const response = await api.post('/api/orders/cart', {
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                quantity: 1,
                unit: product.unit || 'шт',
            })
            setCartItems(response.data.items || [])
            setTotalItems(response.data.totalItems || 0)
            setTotalAmount(response.data.totalAmount || 0)
            return true
        } catch (err) {
            console.error('Ошибка добавления в корзину:', err)
            return false
        }
    }

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await api.put(
                `/api/orders/cart/${productId}?quantity=${quantity}`
            )
            setCartItems(response.data.items || [])
            setTotalItems(response.data.totalItems || 0)
            setTotalAmount(response.data.totalAmount || 0)
        } catch (err) {
            console.error('Ошибка обновления количества:', err)
        }
    }

    const removeFromCart = async (productId) => {
        try {
            const response = await api.delete(`/api/orders/cart/${productId}`)
            setCartItems(response.data.items || [])
            setTotalItems(response.data.totalItems || 0)
            setTotalAmount(response.data.totalAmount || 0)
        } catch (err) {
            console.error('Ошибка удаления из корзины:', err)
        }
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            totalItems,
            totalAmount,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            fetchCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}