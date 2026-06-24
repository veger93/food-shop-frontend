import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

// Словарь эмодзи по названию категории
const CATEGORY_EMOJI = {
    'Овощи': '🥦',
    'Фрукты': '🍎',
    'Молочка': '🥛',
    'Мясо': '🥩',
    'Хлеб': '🍞',
    'Напитки': '🧃',
}

function ProductCard({ product }) {
    const { addToCart } = useCart()
    const { user } = useAuth()
    const [added, setAdded] = useState(false)

    const handleAddToCart = async () => {
        if (!user) {
            alert('Войдите чтобы добавить товар в корзину')
            return
        }
        const success = await addToCart(product)
        if (success) {
            setAdded(true)
            setTimeout(() => setAdded(false), 1000)
        }
    }

    const emoji = CATEGORY_EMOJI[product.categoryName] || '🛒'

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">

            <div className="bg-gray-750 h-20 flex items-center justify-center text-4xl bg-gray-700/50">
                {emoji}
            </div>

            <div className="p-2.5">
                <div className="text-sm font-medium text-white mb-0.5 leading-tight">
                    {product.name}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                    {product.unit}
                </div>
                <div className="flex justify-between items-center">
          <span className="text-white font-medium text-sm">
            {product.price} ₽
          </span>
                    <button
                        onClick={handleAddToCart}
                        className={`w-7 h-7 rounded-full text-white font-medium transition-all
              ${added
                            ? 'bg-green-500 scale-110'
                            : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'}`}
                    >
                        {added ? '✓' : '+'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard