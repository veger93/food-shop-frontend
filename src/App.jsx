import { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import Toast from './components/Toast'
import { useToast } from './hooks/useToast'

function App() {
    const [page, setPage] = useState('home')
    const { toast, showToast, hideToast } = useToast()

    return (
        <div className="min-h-screen bg-gray-900">
            <Header
                onCartClick={() => setPage('cart')}
                onOrdersClick={() => setPage('orders')}
                onHomeClick={() => setPage('home')}
            />

            {page === 'home' && <HomePage showToast={showToast} />}
            {page === 'cart' && (
                <CartPage
                    onBack={() => setPage('home')}
                    showToast={showToast}
                />
            )}
            {page === 'orders' && <OrdersPage onBack={() => setPage('home')} showToast={showToast} />}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    )
}

export default App