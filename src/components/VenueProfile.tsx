'use client'
import { updateVenue } from '@/app/actions'
import type { Venue, MenuItem } from '@/generated/prisma'


interface VenueWithMenu extends Venue {
  menuItems: MenuItem[]
}

interface VenueProfileProps {
  venue: VenueWithMenu
}

export default function VenueProfile({ venue }: VenueProfileProps) {
  const handleUpdate = async (data: Partial<Venue>) => {
    await updateVenue(venue.id, data)
    // Обновляем данные, если нужно
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">{venue.name}</h1>
      {/* Остальной интерфейс */}
    </div>
  )
}
