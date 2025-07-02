'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Star, ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import GoogleMap from '@/components/GoogleMap'

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

function NewReviewForm() {
  const [storeName, setStoreName] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [showMap, setShowMap] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // URLパラメータから店舗情報を取得
  useEffect(() => {
    const storeNameParam = searchParams.get('storeName')
    const placeIdParam = searchParams.get('placeId')
    const addressParam = searchParams.get('address')
    const latParam = searchParams.get('lat')
    const lngParam = searchParams.get('lng')
    
    if (storeNameParam) {
      setStoreName(storeNameParam)
      
      if (placeIdParam) {
        const placeData: PlaceResult = {
          place_id: placeIdParam,
          name: storeNameParam,
          formatted_address: addressParam || ''
        }
        
        // 位置情報があれば追加
        if (latParam && lngParam) {
          placeData.geometry = {
            location: {
              lat: parseFloat(latParam),
              lng: parseFloat(lngParam)
            }
          }
        }
        
        setSelectedPlace(placeData)
        setShowMap(true)
      }
    }
  }, [searchParams])
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  try {
    // 1. 店舗を検索または作成
    let storeId
    
    // Google Place IDがある場合は既存店舗を検索
    let existingStore = null
    if (selectedPlace?.place_id) {
      const { data } = await supabase
        .from('stores')
        .select('id')
        .eq('google_place_id', selectedPlace.place_id)
        .single()
      existingStore = data
    }
    
    // 既存店舗がない場合は店舗名で検索
    if (!existingStore) {
      const { data } = await supabase
        .from('stores')
        .select('id')
        .eq('name', storeName)
        .single()
      existingStore = data
    }
    
    if (existingStore) {
      // 既存店舗を使用
      storeId = existingStore.id
    } else {
      // 新規店舗を作成
      const storeData = {
        name: storeName,
        phone: '', // 一旦空文字で作成
        address: selectedPlace?.formatted_address || null,
        google_place_id: selectedPlace?.place_id || null,
        latitude: selectedPlace?.geometry?.location.lat || null,
        longitude: selectedPlace?.geometry?.location.lng || null,
      }
      
      const { data: newStore, error: storeError } = await supabase
        .from('stores')
        .insert(storeData)
        .select('id')
        .single()
      
      if (storeError) throw storeError
      storeId = newStore.id
    }
    
    // 2. レビューを作成
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        store_id: storeId,
        reviewer_name: reviewerName || '匿名',
        rating: rating,
        content: content,
        is_published: true, // 新コンセプトでは即座に公開
      })
    
    if (reviewError) throw reviewError
    
    // 成功時の処理
    alert('レビューが投稿されました！')
    
    // フォームをリセット
    setStoreName('')
    setRating(0)
    setContent('')
    setReviewerName('')
    setSelectedPlace(null)
    setShowMap(false)
    
} catch (error) {
  console.error('投稿エラー詳細:', error)
  
  // Supabaseエラーの詳細を取得
  if (error && typeof error === 'object') {
    console.error('エラー全体:', JSON.stringify(error, null, 2))
  }
  
  const errorMessage = error instanceof Error ? error.message : 
    (error && typeof error === 'object' && 'message' in error) ? 
    (error as { message: string }).message : String(error)
  
  alert(`投稿エラー詳細: ${errorMessage}`)
} finally {
  setIsSubmitting(false)
}
}

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るボタン */}
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          トップページに戻る
        </Link>

        {/* メインフォーム */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            レビューを投稿
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 選択された店舗情報を最上位に表示 */}
            {selectedPlace && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 text-lg">{selectedPlace.name}</h3>
                    {selectedPlace.formatted_address && (
                      <p className="text-sm text-blue-700">{selectedPlace.formatted_address}</p>
                    )}
                    <p className="text-xs text-green-600 mt-1">✅ 前ページで選択された店舗</p>
                  </div>
                </div>
              </div>
            )}

            {/* 店舗検索（変更したい場合のみ） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                店舗名を変更する場合 <span className="text-gray-500">（任意）</span>
              </label>
              <PlacesAutocomplete
                value={storeName}
                onChange={setStoreName}
                onPlaceSelect={(place) => {
                  setSelectedPlace(place)
                  setStoreName(place.name)
                  setShowMap(true)
                }}
                placeholder="別の店舗を検索する場合は入力してください"
              />
              {!selectedPlace && storeName && (
                <p className="text-sm text-gray-500 mt-1">
                  Google Placesで見つからない場合、手動で入力された店舗名を使用します
                </p>
              )}
            </div>

            {/* 地図表示 */}
            {showMap && selectedPlace?.geometry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  店舗位置
                </label>
                <GoogleMap
                  center={{
                    lat: selectedPlace.geometry.location.lat,
                    lng: selectedPlace.geometry.location.lng
                  }}
                  markers={[{
                    position: {
                      lat: selectedPlace.geometry.location.lat,
                      lng: selectedPlace.geometry.location.lng
                    },
                    title: selectedPlace.name,
                    info: `<div><strong>${selectedPlace.name}</strong><br/>${selectedPlace.formatted_address}</div>`
                  }]}
                  className="w-full h-48 rounded-lg border"
                />
              </div>
            )}

            {/* デバッグ情報（開発時のみ表示） */}
            {process.env.NODE_ENV === 'development' && false && (
              <div className="bg-gray-100 p-2 rounded text-xs mb-4">
                <p><strong>🔍 デバッグ情報:</strong></p>
                <p>showMap: {showMap ? 'true' : 'false'}</p>
                <p>selectedPlace: {selectedPlace ? 'exists' : 'null'}</p>
                <p>geometry: {selectedPlace?.geometry ? 'exists' : 'null'}</p>
                <p>storeName: {storeName || 'empty'}</p>
                {selectedPlace?.geometry && (
                  <>
                    <p>lat: {selectedPlace.geometry.location.lat}</p>
                    <p>lng: {selectedPlace.geometry.location.lng}</p>
                  </>
                )}
                <p><strong>URLパラメータ:</strong></p>
                <p>lat param: {searchParams.get('lat') || 'なし'}</p>
                <p>lng param: {searchParams.get('lng') || 'なし'}</p>
              </div>
            )}

            {/* 評価 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評価 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-gray-600">
                  {rating > 0 ? `${rating}/5` : '評価を選択してください'}
                </span>
              </div>
            </div>

            {/* レビュー内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                レビュー内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="お店のサービスや雰囲気について詳しく教えてください..."
                required
              />
            </div>

            {/* 投稿者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前（任意）
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="匿名"
              />
            </div>

            {/* 投稿ボタン */}
            <button
              type="submit"
              disabled={!storeName || !rating || !content || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isSubmitting ? '投稿中...' : 'レビューを投稿'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-500">読み込み中...</p>
      </div>
    </div>}>
      <NewReviewForm />
    </Suspense>
  )
}