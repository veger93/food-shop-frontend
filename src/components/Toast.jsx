import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {
    // Автоматически закрываем через 3 секунды
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        // Возвращаем функцию очистки — она вызовется если компонент
        // исчезнет раньше чем пройдут 3 секунды, чтобы не было утечки памяти
        return () => clearTimeout(timer)
    }, [])

    const styles = {
        success: 'bg-green-500/10 border-green-500/30 text-green-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
        info: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    }

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
    }

    return (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 
      border rounded-xl px-4 py-3 text-sm flex items-center gap-2 
      shadow-lg backdrop-blur-sm animate-fade-in ${styles[type]}`}>
            <span className="font-bold">{icons[type]}</span>
            {message}
        </div>
    )
}

export default Toast