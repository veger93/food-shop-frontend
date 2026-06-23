import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

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
            // Показываем визуальный отклик — кнопка меняется на ✓ на секунду
            setAdded(true)
            setTimeout(() => setAdded(false), 1000)
        }
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-700 h-20 flex items-center justify-center text-3xl">
                🥦
            </div>

            <div className="p-2.5">
                <div className="text-sm font-medium text-white mb-0.5">
                    {product.name}
                </div>
                <div className="text-xs text-gray-500 mb-1.5">
                    {product.unit}
                </div>
                <div className="flex justify-between items-center">
          <span className="text-white font-medium">
            {product.price} ₽
          </span>
                    <button
                        onClick={handleAddToCart}
                        className={`w-6 h-6 rounded-full text-white text-base leading-none transition-colors
              ${added
                            ? 'bg-green-500'
                            : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                        {added ? '✓' : '+'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard