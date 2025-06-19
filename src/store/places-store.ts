import { create } from 'zustand';
import type { PlaceInfo } from '@/types/place';

type PlacesStore = {
  places: PlaceInfo[];
  setPlaces: (places: PlaceInfo[]) => void;
  updatePlace: (updatedPlace: PlaceInfo) => void;
};

export const usePlaces = create<PlacesStore>((set) => ({
  places: [],
  setPlaces: (places) => set({ places }),
  updatePlace: (updatedPlace) => 
    set(state => ({
      places: state.places.map(place => 
        place.id === updatedPlace.id ? updatedPlace : place
      )
    }))
}));