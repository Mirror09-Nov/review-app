'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface GoogleMapProps {
  center: {
    lat: number
    lng: number
  }
  zoom?: number
  markers?: Array<{
    position: {
      lat: number
      lng: number
    }
    title?: string
    info?: string
  }>
  className?: string
}

export default function GoogleMap({
  center,
  zoom = 15,
  markers = [],
  className = "w-full h-64 rounded-lg"
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeMap = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        setError('Google Maps API key is not configured')
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

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          })

          mapInstanceRef.current = map

          // マーカーを追加
          markers.forEach(marker => {
            const mapMarker = new google.maps.Marker({
              position: marker.position,
              map,
              title: marker.title
            })

            // 情報ウィンドウを追加
            if (marker.info) {
              const infoWindow = new google.maps.InfoWindow({
                content: marker.info
              })

              mapMarker.addListener('click', () => {
                infoWindow.open(map, mapMarker)
              })
            }
          })
        }
      } catch (error) {
        console.error('Failed to load Google Maps:', error)
        setError('地図の読み込みに失敗しました')
      }
    }

    initializeMap()
  }, [center, zoom, markers])

  // 中心位置が変更されたときに地図を更新
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter(center)
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [center, zoom, isLoaded])

  if (error) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      {!isLoaded && (
        <div className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">地図を読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  )
}