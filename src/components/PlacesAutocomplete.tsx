'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MapPin } from 'lucide-react'

interface PlaceResult {
  place_id: string
  formatted_address: string
  name: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceResult) => void
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = "店舗名を入力してください...",
  value = "",
  onChange
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key is not configured')
        return
      }

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        })

        await loader.load()
        setIsLoaded(true)

        if (inputRef.current) {
          // 日本の場所を優先するオプション
          const options = {
            componentRestrictions: { country: 'jp' },
            fields: ['place_id', 'formatted_address', 'name', 'geometry'],
            types: ['establishment'] // 店舗・施設のみに限定
          }

          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            options
          )

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace()
            
            if (place && place.place_id) {
              const placeResult: PlaceResult = {
                place_id: place.place_id,
                formatted_address: place.formatted_address || '',
                name: place.name || '',
                geometry: place.geometry ? {
                  location: {
                    lat: place.geometry.location?.lat() || 0,
                    lng: place.geometry.location?.lng() || 0
                  }
                } : undefined
              }

              setInputValue(place.name || '')
              onPlaceSelect(placeResult)
              onChange?.(place.name || '')
            }
          })
        }
      } catch (error) {
        console.error('Failed to load Google Maps API:', error)
      }
    }

    initializeAutocomplete()

    // クリーンアップ
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onPlaceSelect, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={isLoaded ? placeholder : "Google Maps APIを読み込み中..."}
        disabled={!isLoaded}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}