import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// Цвет и текст для каждого статуса заказа
const STATUS_CONFIG = {
    PENDING: {
        label: 'Ожидает подтверждения',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10 border-yellow-400/30',
        icon: '⏳'
    },
    CONFIRMED: {
        label: 'Подтверждён',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10 border-blue-400/30',
        icon: '✅'
    },
    PREPARING: {
        label: 'Готовится',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10 border-orange-400/30',
        icon: '👨‍🍳'
    },
    DELIVERING: {
        label: 'В пути',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10 border-purple-400/30',
        icon: '🚚'
    },
    DELIVERED: {
        label: 'Доставлен',
        color: 'text-green-400',
        bg: 'bg-green-400/10 border-green-400/30',
        icon: '🎉'
    },
    CANCELLED: {
        label: 'Отменён',
        color: 'text-red-400',
        bg: 'bg-red-400/10 border-red-400/30',
        icon: '❌'
    },
}

// Отдельный компонент для одного заказа
// Вынесли чтобы не загромождать основной компонент
function OrderCard({ order, onCancel }) {
    const [expanded, setExpanded] = useState(false)
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING

    // Форматируем дату из ISO строки в читаемый вид
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">

            {/* Шапка карточки заказа — всегда видна */}
            <div
                className="p-4 cursor-pointer hover:bg-gray-750"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-gray-400 text-xs">Заказ №{order.id}</span>
                        <div className="text-white font-medium mt-0.5">
                            {order.totalAmount} ₽
                        </div>
                    </div>

                    {/* Бейдж статуса */}
                    <div className={`border rounded-full px-2.5 py-1 text-xs flex items-center gap-1.5 ${status.bg}`}>
                        <span>{status.icon}</span>
                        <span className={status.color}>{status.label}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-xs">
                        {formatDate(order.createdAt)}
                    </div>
                    <div className="text-gray-500 text-xs">
                        {expanded ? '▲ Скрыть' : '▼ Подробнее'}
                    </div>
                </div>
            </div>

            {/* Раскрывающийся список товаров */}
            {expanded && (
                <div className="border-t border-gray-700 px-4 py-3">

                    {/* Адрес доставки */}
                    <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{order.deliveryAddress}</span>
                    </div>

                    {/* Позиции заказа */}
                    <div className="space-y-2 mb-3">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">{item.quantity}×</span>
                                    <span className="text-white">{item.productName}</span>
                                    <span className="text-gray-500 text-xs">{item.unit}</span>
                                </div>
                                <span className="text-orange-400">{item.subtotal} ₽</span>
                            </div>
                        ))}
                    </div>

                    {/* Кнопка отмены — только для PENDING заказов */}
                    {order.status === 'PENDING' && (
                        <button
                            onClick={(e) => {
                                // stopPropagation — останавливаем всплытие события
                                // чтобы клик по кнопке не закрыл карточку
                                e.stopPropagation()
                                onCancel(order.id)
                            }}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 rounded-full px-3 py-1 hover:bg-red-400/10 transition-colors"
                        >
                            Отменить заказ
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// Главный компонент страницы
function OrdersPage({ onBack, showToast }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            fetchOrders()
        }
    }, [user])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await api.get('/api/orders')
            setOrders(response.data)
        } catch (err) {
            console.error('Ошибка загрузки заказов:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (orderId) => {
        try {
            await api.patch(`/api/orders/${orderId}/cancel`)
            showToast('Заказ отменён', 'info')
            fetchOrders()
        } catch (err) {
            showToast(err.response?.data?.message || 'Ошибка отмены заказа', 'error')
        }
    }
    
    if (!user) {
        return (
            <div className="px-5 py-10 text-center">
                <p className="text-gray-400">Войдите чтобы просмотреть заказы</p>
                <button onClick={onBack} className="text-orange-500 mt-3 hover:underline">
                    ← Назад
                </button>
            </div>
        )
    }

    return (
        <div className="px-5 py-6 max-w-lg mx-auto">

            {/* Шапка страницы */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    ←
                </button>
                <h2 className="text-white text-lg font-medium">Мои заказы</h2>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-10">
                    Загрузка заказов...
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-10">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-gray-400 mb-4">Заказов пока нет</p>
                    <button
                        onClick={onBack}
                        className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600"
                    >
                        Перейти в каталог
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onCancel={handleCancel}
                            showToast={showToast}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersPage