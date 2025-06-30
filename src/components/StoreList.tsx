'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MapPin, Star } from 'lucide-react'

const supabase = createClientComponentClient()

interface Store {
  id: string
  name: string
  phone: string
  address: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setStores(data || [])
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">店舗データを読み込み中...</p>
      </div>
    )
  }

  return (
    <div>
      {stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">店舗が見つかりません。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🏪</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {store.name}
                </h3>
                {store.address && (
                  <div className="flex items-start text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                )}
                {store.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {store.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">レビューを書く</span>
                  </div>
                  <span className="text-blue-600 text-sm font-medium">
                    詳細 →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}