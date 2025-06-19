'use client'
import { useEffect } from 'react';
import { usePlaces } from '@/store/places-store';

export function WebSocketProvider() {
  const updatePlace = usePlaces((state: { updatePlace: any; }) => state.updatePlace);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/places`);

    socket.onmessage = (event) => {
      const updatedPlace = JSON.parse(event.data);
      updatePlace(updatedPlace);
    };

    return () => socket.close();
  }, [updatePlace]);

  return null;
}