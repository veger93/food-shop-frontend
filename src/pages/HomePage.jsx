import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

// Эмодзи для категорий — используем imageUrl из БД
// Если нет — показываем дефолтный
const DEFAULT_EMOJI = '🛒'

function HomePage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')

    // Загружаем категории один раз при старте
    useEffect(() => {
        api.get('/api/products/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Ошибка загрузки категорий:', err))
    }, [])

    // Загружаем товары когда меняется категория или поисковый запрос
    useEffect(() => {
        setLoading(true)
        setError(null)

        let url = '/api/products'
        if (search) {
            url = `/api/products?search=${encodeURIComponent(search)}`
        } else if (selectedCategory) {
            url = `/api/products?categoryId=${selectedCategory}`
        }

        api.get(url)
            .then(res => {
                setProducts(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Ошибка загрузки товаров:', err)
                setError('Не удалось загрузить товары')
                setLoading(false)
            })
    }, [selectedCategory, search])

    // Поиск запускается только по нажатию Enter или кнопки
    // чтобы не слать запрос на каждую букву
    const handleSearch = () => {
        setSelectedCategory(null)
        setSearch(searchInput)
    }

    const handleCategoryClick = (categoryId) => {
        setSearch('')
        setSearchInput('')
        // Повторный клик по активной категории — сбрасываем фильтр
        setSelectedCategory(prev => prev === categoryId ? null : categoryId)
    }

    return (
        <div>

            {/* Hero баннер */}
            <div className="mx-5 mt-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/20 p-6 relative overflow-hidden">

                {/* Декоративный фон */}
                <div className="absolute right-6 top-4 text-7xl opacity-10 select-none">
                    🥦
                </div>

                <div className="inline-block bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full mb-3">
                    🚀 Доставка за 30 минут
                </div>

                <h1 className="text-white text-2xl font-medium leading-tight mb-2">
                    Свежие продукты<br />
                    прямо <span className="text-orange-500">к двери</span>
                </h1>

                <p className="text-gray-400 text-sm mb-4">
                    Фрукты, овощи, молочка и многое другое
                </p>

                <div className="inline-block bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Промокод: </span>
                    <span className="text-orange-400 font-medium text-sm">FRESH20</span>
                    <span className="text-orange-500 text-lg font-medium ml-3">−20%</span>
                </div>
            </div>

            {/* Поиск */}
            <div className="mx-5 mt-4 flex gap-2">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Поиск товаров..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                    Найти
                </button>
                {search && (
                    <button
                        onClick={() => { setSearch(''); setSearchInput('') }}
                        className="text-gray-400 hover:text-white px-2"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Категории */}
            <div className="flex gap-2 px-5 mt-4 overflow-x-auto pb-1 scrollbar-hide">

                {/* Кнопка "Все" */}
                <button
                    onClick={() => handleCategoryClick(null)}
                    className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap
            ${selectedCategory === null && !search
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
                >
                    🛒 Все
                </button>

                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap
              ${selectedCategory === cat.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
                    >
                        {cat.imageUrl || DEFAULT_EMOJI} {cat.name}
                    </button>
                ))}
            </div>

            {/* Заголовок секции */}
            <div className="px-5 mt-5 mb-3 flex justify-between items-center">
                <h2 className="text-white font-medium">
                    {search
                        ? `Результаты: «${search}»`
                        : selectedCategory
                            ? categories.find(c => c.id === selectedCategory)?.name || 'Товары'
                            : 'Популярное'}
                </h2>
                <span className="text-gray-500 text-sm">
          {products.length} товаров
        </span>
            </div>

            {/* Сетка товаров */}
            <div className="px-5 pb-8">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">
                        Загрузка...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 py-10">{error}</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-gray-400">Ничего не найдено</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default HomePage