// app/venue/profile/page.tsx
'use client'
import { useState } from 'react'

export default function VenueProfile() {
  // Состояние для данных заведения
  const [venueData, setVenueData] = useState({
    name: 'Vid Coffee',
    address: 'ул. Примерная, 123',
    phone: '+7 999 123-45-67',
    menuItems: [
      { id: 1, name: 'Капучино', price: 250, quantity: 10 },
      { id: 2, name: 'Латте', price: 280, quantity: 8 }
    ]
  })

  // Состояние для новой позиции меню
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: ''
  })

  // Добавление новой позиции
  const addMenuItem = () => {
    if (newItem.name && newItem.price && newItem.quantity) {
      setVenueData({
        ...venueData,
        menuItems: [
          ...venueData.menuItems,
          {
            id: Date.now(),
            name: newItem.name,
            price: Number(newItem.price),
            quantity: Number(newItem.quantity)
          }
        ]
      })
      setNewItem({ name: '', price: '', quantity: '' })
    }
  }

  // Удаление позиции
  const removeMenuItem = (id: number) => {
    setVenueData({
      ...venueData,
      menuItems: venueData.menuItems.filter(item => item.id !== id)
    })
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Профиль заведения</h1>
      
      {/* Основная информация */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{venueData.name}</h2>
        <p className="mb-2">Адрес: {venueData.address}</p>
        <p>Телефон: {venueData.phone}</p>
      </div>

      {/* Меню */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ваше меню</h2>
        {venueData.menuItems.length === 0 ? (
          <p className="text-gray-500">Пока нет позиций в меню</p>
        ) : (
          <ul className="space-y-3">
            {venueData.menuItems.map(item => (
              <li key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.price}₽ · {item.quantity} шт.
                  </p>
                </div>
                <button 
                  onClick={() => removeMenuItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Добавление новой позиции */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Добавить позицию</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Название"
            className="w-full p-2 border rounded"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Цена (₽)"
              className="p-2 border rounded"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
            <input
              type="number"
              placeholder="Количество"
              className="p-2 border rounded"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
            />
          </div>
          <button
            onClick={addMenuItem}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Добавить в меню
          </button>
        </div>
      </div>
    </div>
  )
}