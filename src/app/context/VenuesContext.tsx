// app/context/VenuesContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MenuItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Venue {
  id: string
  name: string
  address: string
  phone: string
  coordinates: [number, number]
  hours: string
  menuItems: MenuItem[]
}

interface VenuesContextType {
  venues: Venue[]
  addVenue: (venue: Omit<Venue, 'id'>) => void
  updateVenue: (id: string, updates: Partial<Venue>) => void
}

const VenuesContext = createContext<VenuesContextType | undefined>(undefined)

export function VenuesProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: '1',
      name: 'Vid Coffee',
      address: 'ул. Примерная, 123',
      phone: '+7 999 123-45-67',
      coordinates: [59.964480, 30.296195],
      hours: 'Ежедневно с 08:00 до 20:00',
      menuItems: [
        { id: 1, name: 'Капучино', price: 250, quantity: 10 },
        { id: 2, name: 'Латте', price: 280, quantity: 8 }
      ]
    }
  ])

  const addVenue = (venue: Omit<Venue, 'id'>) => {
    setVenues([...venues, { ...venue, id: Date.now().toString() }])
  }

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues(venues.map(venue => venue.id === id ? { ...venue, ...updates } : venue))
  }

  return (
    <VenuesContext.Provider value={{ venues, addVenue, updateVenue }}>
      {children}
    </VenuesContext.Provider>
  )
}

export function useVenues() {
  const context = useContext(VenuesContext)
  if (context === undefined) {
    throw new Error('useVenues must be used within a VenuesProvider')
  }
  return context
}