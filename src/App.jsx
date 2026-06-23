import { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'

function App() {
    // Текущая страница: 'home' или 'cart'
    const [page, setPage] = useState('home')

    return (
        <div className="min-h-screen bg-gray-900">
            <Header onCartClick={() => setPage('cart')} />

            {page === 'home' && <HomePage />}
            {page === 'cart' && <CartPage onBack={() => setPage('home')} />}
        </div>
    )
}

export default App