import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { useState } from 'react'

function CartPage({ onBack, showToast }) {
    // const { cartItems, totalAmount, updateQuantity, removeFromCart } = useCart()
    const { user } = useAuth()
    const [address, setAddress] = useState('')
    const [ordering, setOrdering] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const { cartItems, totalAmount, updateQuantity, removeFromCart, fetchCart } = useCart()

    const handleCheckout = async () => {
        if (!address.trim()) {
            showToast('Введите адрес доставки')
            return
        }

        try {
            setOrdering(true)
            await api.post(
                `/api/orders/checkout?deliveryAddress=${encodeURIComponent(address)}`
            )
            await fetchCart() // ← добавь эту строку — перезагружаем корзину с сервера
            setOrderSuccess(true)
        } catch (err) {
            showToast(err.response?.data?.message || 'Ошибка оформления заказа')
        } finally {
            setOrdering(false)
        }
    }

    // Если заказ оформлен — показываем успех
    if (orderSuccess) {
        return (
            <div className="px-5 py-10 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-white text-xl font-medium mb-2">
                    Заказ оформлен!
                </h2>
                <p className="text-gray-400 mb-6">
                    Мы уже готовим вашу доставку
                </p>
                <button
                    onClick={onBack}
                    className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600"
                >
                    Вернуться в каталог
                </button>
            </div>
        )
    }

    // Если не залогинен
    if (!user) {
        return (
            <div className="px-5 py-10 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <p className="text-gray-400 mb-4">
                    Войдите чтобы просмотреть корзину
                </p>
                <button
                    onClick={onBack}
                    className="text-orange-500 hover:underline"
                >
                    ← Назад
                </button>
            </div>
        )
    }

    // Если корзина пустая
    if (cartItems.length === 0) {
        return (
            <div className="px-5 py-10 text-center">
                <div className="text-5xl mb-4">🛍</div>
                <p className="text-gray-400 mb-4">Корзина пуста</p>
                <button
                    onClick={onBack}
                    className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600"
                >
                    Перейти в каталог
                </button>
            </div>
        )
    }

    return (
        <div className="px-5 py-6 max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-5">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white"
                >
                    ←
                </button>
                <h2 className="text-white text-lg font-medium">Корзина</h2>
            </div>

            {/* Список товаров */}
            <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3"
                    >
                        <div className="text-2xl">🥦</div>

                        <div className="flex-1">
                            <div className="text-sm text-white font-medium">
                                {item.productName}
                            </div>
                            <div className="text-xs text-gray-400">
                                {item.productPrice} ₽ / {item.unit}
                            </div>
                        </div>

                        {/* Кнопки изменения количества */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-6 h-6 bg-gray-700 rounded-full text-white hover:bg-gray-600 flex items-center justify-center"
                            >
                                −
                            </button>
                            <span className="text-white text-sm w-4 text-center">
                {item.quantity}
              </span>
                            <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-6 h-6 bg-gray-700 rounded-full text-white hover:bg-gray-600 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-orange-500 text-sm font-medium w-16 text-right">
                            {item.subtotal} ₽
                        </div>

                        <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-500 hover:text-red-400 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Итого и поле адреса */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between text-white font-medium mb-4">
                    <span>Итого</span>
                    <span className="text-orange-500">{totalAmount} ₽</span>
                </div>

                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Адрес доставки"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-orange-500"
                />

                <button
                    onClick={handleCheckout}
                    disabled={ordering}
                    className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    {ordering ? 'Оформляем...' : 'Оформить заказ'}
                </button>
            </div>
        </div>
    )
}

export default CartPage