'use client'

import { useState, useEffect } from 'react'
import { useVenues } from '@/app/context/VenuesContext'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'

export default function VenueProfile() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { venues, updateVenue } = useVenues()
  const venueData = venues[0]

  const [editMode, setEditMode] = useState(false)
  const [venueInfo, setVenueInfo] = useState({
    name: venueData.name,
    address: venueData.address,
    phone: venueData.phone,
    hours: venueData.hours,
    coordinates: venueData.coordinates
  })

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: ''
  })

  // Авторизация
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check')
        if (!res.ok) router.push('/venue/login')
        else setIsAuthenticated(true)
      } catch {
        router.push('/venue/login')
      }
    }
    checkAuth()
  }, [router])

  const saveToServer = async (data: any) => {
    await fetch('/api/venues', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  const saveVenueInfo = async () => {
    const updatedVenue = {
      ...venueData,
      ...venueInfo,
      coordinates: [
        Number(venueInfo.coordinates[0]),
        Number(venueInfo.coordinates[1])
      ] as [number, number]
    }
    

    updateVenue(venueData.id, updatedVenue)
    await saveToServer(updatedVenue)
    setEditMode(false)
  }

  const addMenuItem = async () => {
    if (newItem.name && newItem.price && newItem.quantity) {
      const updatedMenuItems = [
        ...venueData.menuItems,
        {
          id: Date.now(),
          name: newItem.name,
          price: Number(newItem.price),
          quantity: Number(newItem.quantity)
        }
      ]

      const updatedVenue = { ...venueData, menuItems: updatedMenuItems }
      updateVenue(venueData.id, updatedVenue)
      await saveToServer(updatedVenue)
      setNewItem({ name: '', price: '', quantity: '' })
    }
  }

  const removeMenuItem = async (id: number) => {
    const updatedMenuItems = venueData.menuItems.filter(item => item.id !== id)
    const updatedVenue = { ...venueData, menuItems: updatedMenuItems }

    updateVenue(venueData.id, updatedVenue)
    await saveToServer(updatedVenue)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Проверка авторизации...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Профиль заведения</h1>
        <button
          onClick={() => editMode ? saveVenueInfo() : setEditMode(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {editMode ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>

      {/* Инфо о заведении */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        {editMode ? (
          <div className="space-y-3">
            <input
              value={venueInfo.name}
              onChange={(e) => setVenueInfo({...venueInfo, name: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              value={venueInfo.address}
              onChange={(e) => setVenueInfo({...venueInfo, address: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              value={venueInfo.phone}
              onChange={(e) => setVenueInfo({...venueInfo, phone: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              value={venueInfo.hours}
              onChange={(e) => setVenueInfo({...venueInfo, hours: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={venueInfo.coordinates[0]}
                onChange={(e) => setVenueInfo({
                  ...venueInfo,
                  coordinates: [Number(e.target.value), venueInfo.coordinates[1]]
                })}
                className="p-2 border rounded"
                placeholder="Широта"
              />
              <input
                type="number"
                value={venueInfo.coordinates[1]}
                onChange={(e) => setVenueInfo({
                  ...venueInfo,
                  coordinates: [venueInfo.coordinates[0], Number(e.target.value)]
                })}
                className="p-2 border rounded"
                placeholder="Долгота"
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">{venueData.name}</h2>
            <p>Адрес: {venueData.address}</p>
            <p>Телефон: {venueData.phone}</p>
            <p>Часы работы: {venueData.hours}</p>
            <p className="text-sm text-gray-500">
              Координаты: {venueData.coordinates.join(', ')}
            </p>
          </>
        )}
      </div>

      {/* Меню */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ваше меню</h2>
        {venueData.menuItems.length === 0 ? (
          <p className="text-gray-500">Пока нет позиций</p>
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
