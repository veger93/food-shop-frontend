import { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'

function App() {
    const [page, setPage] = useState('home')

    return (
        <div className="min-h-screen bg-gray-900">
            <Header
                onCartClick={() => setPage('cart')}
                onOrdersClick={() => setPage('orders')}
            />

            {page === 'home' && <HomePage />}
            {page === 'cart' && <CartPage onBack={() => setPage('home')} />}
            {page === 'orders' && <OrdersPage onBack={() => setPage('home')} />}
        </div>
    )
}

export default App