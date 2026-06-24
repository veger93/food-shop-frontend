import { useState } from 'react'
import api from '../api/axios'

function ImageUpload({ onUpload, currentImage }) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(currentImage || null)

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Показываем превью сразу — до загрузки на сервер
        // URL.createObjectURL создаёт временную ссылку на файл в памяти браузера
        const localPreview = URL.createObjectURL(file)
        setPreview(localPreview)

        // Формируем multipart/form-data запрос
        // FormData — встроенный браузерный класс для отправки файлов
        const formData = new FormData()
        formData.append('file', file)

        try {
            setUploading(true)
            const response = await api.post('/api/files/upload', formData, {
                headers: {
                    // Явно указываем тип — axios иначе может не поставить boundary
                    'Content-Type': 'multipart/form-data',
                },
            })

            // Передаём URL родительскому компоненту
            onUpload(response.data.url)
        } catch (err) {
            console.error('Ошибка загрузки:', err)
            setPreview(currentImage || null)
            alert('Не удалось загрузить картинку')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="relative">
            {/* Область превью или заглушка */}
            <div className="h-32 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                {preview ? (
                    <img
                        src={preview}
                        alt="Превью"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Нет фото</span>
                )}
            </div>

            {/* Кнопка выбора файла */}
            <label className={`block w-full text-center text-sm py-2 rounded-lg cursor-pointer transition-colors
        ${uploading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                {uploading ? 'Загружаем...' : '📷 Выбрать фото'}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
        </div>
    )
}

export default ImageUpload