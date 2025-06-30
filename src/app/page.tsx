'use client'

import { Star, Building2, Edit3 } from 'lucide-react'
import StoreList from '@/components/StoreList'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  
  const handlePlaceSelect = (place: { place_id: string; name: string; formatted_address: string }) => {
    // 選択された店舗でレビューページに遷移
    const params = new URLSearchParams({
      storeName: place.name,
      placeId: place.place_id,
      address: place.formatted_address || ''
    })
    router.push(`/review/new?${params.toString()}`)
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          お店の声を届けよう
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          気軽にレビューを投稿して、お店の改善に貢献しませんか？
        </p>
        
        {/* メインのレビュー投稿セクション */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
              <Edit3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">レビューを書く</h2>
          <p className="text-gray-600 mb-6">店舗名を入力してレビューを投稿してください</p>
          
          {/* 店舗検索フィールド */}
          <div className="mb-6">
            <PlacesAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onPlaceSelect={handlePlaceSelect}
              placeholder="店舗名を入力してください（Google Places検索対応）"
            />
          </div>
          
          <Link href="/review/new" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center">
            レビューを書く
          </Link>
        </div>
      </div>

      {/* 特徴説明 */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">気軽に投稿</h3>
          <p className="text-gray-600">
            店舗登録不要。気になったお店のレビューをすぐに投稿できます。
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">店舗改善に貢献</h3>
          <p className="text-gray-600">
            あなたのレビューが店舗の改善につながり、より良いサービスを生み出します。
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">質の高いレビュー</h3>
          <p className="text-gray-600">
            建設的なフィードバックで、お店とお客様の良い関係を築きます。
          </p>
        </div>
      </div>

      {/* 最近のレビュー */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">最近レビューされた店舗</h2>
        <StoreList />
      </div>
    </div>
  )
}