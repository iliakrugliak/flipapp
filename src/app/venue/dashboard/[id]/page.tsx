'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VenueProfile from '@/app/components/VenueProfile'

export default function VenueDashboard({ params }: { params: { id: string } }) {
  const [venue, setVenue] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const res = await fetch(`/api/venue/${params.id}`)
        if (!res.ok) throw new Error()
        setVenue(await res.json())
      } catch (error) {
        router.push('/login')
      }
    }
    loadVenue()
  }, [params.id, router])

  if (!venue) return <div>Загрузка...</div>

  return <VenueProfile venue={venue} />
}