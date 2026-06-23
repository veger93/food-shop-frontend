import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function HomePage() {

    // products — массив товаров, изначально пустой
    // setProducts — функция чтобы ИЗМЕНИТЬ этот массив
    const [products, setProducts] = useState([])

    // loading — флаг "идёт загрузка", изначально true
    const [loading, setLoading] = useState(true)

    // error — текст ошибки если запрос не удался
    const [error, setError] = useState(null)

    // useEffect с пустым массивом [] в конце означает:
    // "выполни этот код ОДИН РАЗ, когда компонент появился на экране"
    useEffect(() => {
        api.get('/api/products')
            .then((response) => {
                setProducts(response.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Ошибка загрузки товаров:', err)
                setError('Не удалось загрузить товары')
                setLoading(false)
            })
    }, [])

    // Пока идёт загрузка — показываем простой текст
    if (loading) {
        return (
            <div className="text-center text-gray-400 py-10">
                Загрузка товаров...
            </div>
        )
    }

    // Если случилась ошибка — показываем её
    if (error) {
        return (
            <div className="text-center text-red-400 py-10">
                {error}
            </div>
        )
    }

    return (
        <div className="px-5 py-6">
            <h2 className="text-white text-lg font-medium mb-4">
                Популярное
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default HomePage