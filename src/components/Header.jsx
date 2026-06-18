function Header() {
    return (
        <header className="bg-gray-900 border-b border-gray-800 px-5 py-3 flex items-center justify-between">

            {/* Логотип слева */}
            <div className="text-orange-500 text-lg font-medium">
                🛒 FreshDrop
            </div>

            {/* Ссылки навигации по центру (скрыты на мобильных) */}
            <nav className="hidden md:flex gap-4 text-sm text-gray-400">
                <span className="cursor-pointer hover:text-white">Каталог</span>
                <span className="cursor-pointer hover:text-white">Акции</span>
                <span className="cursor-pointer hover:text-white">О нас</span>
            </nav>

            {/* Корзина и кнопка входа справа */}
            <div className="flex gap-3 items-center">
                <div className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                    🛍 Корзина
                    <span className="bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            0
          </span>
                </div>
                <button className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full font-medium hover:bg-orange-600 transition-colors">
                    Войти
                </button>
            </div>

        </header>
    )
}

export default Header