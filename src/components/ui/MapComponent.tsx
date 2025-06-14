// components/ui/MapComponent.tsx
'use client'
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useVenues } from '@/app/context/VenuesContext'

interface MapComponentProps {
  onPlaceSelect: (place: {
    name: string
    hours: string
    offer: string
    quantity: number
    price: number
  }) => void
}

export default function MapComponent({ onPlaceSelect }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const { venues } = useVenues()

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Инициализация карты
      const map = L.map(mapContainerRef.current, {
        center: [59.96, 30.30],
        zoom: 13,
        zoomControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    }

    return () => {
      // Очистка при размонтировании
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Очищаем предыдущие маркеры
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Добавляем новые маркеры
    venues.forEach(venue => {
      const markerWithLabel = L.divIcon({
        className: 'marker-with-label',
        html: `
          <div style="display: flex; align-items: center; pointer-events: none;">
            <div style="
              width: 24px;
              height: 24px;
              background: #356ac9;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            "></div>
            <span style="
              margin-left: 8px;
              color: #356ac9;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 13px;
              font-weight: 700;
            ">
              ${venue.name}
            </span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker(venue.coordinates, {
        icon: markerWithLabel,
        interactive: true,
      }).addTo(mapRef.current!)

      marker.on("click", (e) => {
        e.originalEvent.preventDefault()
        e.originalEvent.stopPropagation()
        
        const offer = venue.menuItems[0] || {
          name: 'Нет предложений',
          price: 0,
          quantity: 0
        }

        onPlaceSelect({
          name: venue.name,
          hours: venue.hours,
          offer: offer.name,
          quantity: offer.quantity,
          price: offer.price
        })
      })

      markersRef.current.push(marker)
    })
  }, [venues, onPlaceSelect])

  return <div ref={mapContainerRef} className="w-full h-full bg-[#d6e7ff]" />
}