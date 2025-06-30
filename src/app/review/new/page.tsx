'use client'

import { useState } from 'react'
import { Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function NewReviewPage() {
  const [storeName, setStoreName] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
　const supabase = createClientComponentClient()
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  try {
    // 1. 店舗を検索または作成
    let storeId
    
    // まず既存の店舗を検索
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('name', storeName)
      .single()
    
    if (existingStore) {
      // 既存店舗を使用
      storeId = existingStore.id
    } else {
      // 新規店舗を作成
      const { data: newStore, error: storeError } = await supabase
        .from('stores')
        .insert({
          name: storeName,
          phone: '', // 一旦空文字で作成
        })
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
    
} catch (error) {
  console.error('投稿エラー詳細:', error)
  
  // Supabaseエラーの詳細を取得
  if (error && typeof error === 'object') {
    console.error('エラー全体:', JSON.stringify(error, null, 2))
  }
  
  const errorMessage = error instanceof Error ? error.message : 
    (error && typeof error === 'object' && 'message' in error) ? 
    (error as any).message : String(error)
  
  alert(`投稿エラー詳細: ${errorMessage}`)
} finally {
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
            {/* 店舗名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                店舗名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例：カフェ・ド・パリ"
                required
              />
            </div>

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