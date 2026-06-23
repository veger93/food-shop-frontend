function ProductCard({ product }) {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">

            {/* Изображение товара — пока заглушка, картинок у нас нет в БД */}
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
                    <button className="bg-orange-500 text-white w-6 h-6 rounded-full text-base leading-none hover:bg-orange-600">
                        +
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ProductCard