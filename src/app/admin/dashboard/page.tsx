'use client'

import { useState, useEffect } from 'react'
import { Star, Eye, EyeOff, LogOut, MessageSquare, User, Calendar } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Review {
  id: string
  reviewer_name: string | null
  rating: number
  content: string
  is_published: boolean
  created_at: string
}

interface AdminSession {
  managerId: string
  storeId: string
  phone: string
}

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<AdminSession | null>(null)
  const [storeName, setStoreName] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    // セッション確認
    const sessionData = localStorage.getItem('admin_session')
    if (!sessionData) {
      window.location.href = '/admin'
      return
    }

    const parsedSession = JSON.parse(sessionData) as AdminSession
    setSession(parsedSession)
    
    // 店舗情報とレビューを取得
    fetchStoreAndReviews(parsedSession.storeId)
  }, [])

  const fetchStoreAndReviews = async (storeId: string) => {
    try {
      // 店舗名を取得
      const { data: store } = await supabase
        .from('stores')
        .select('name')
        .eq('id', storeId)
        .single()

      if (store) {
        setStoreName(store.name)
      }

      // レビューを取得
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('レビュー取得エラー:', error)
      } else {
        setReviews(reviewsData || [])
      }
    } catch (error) {
      console.error('データ取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (reviewId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', reviewId)

      if (error) {
        console.error('公開状態更新エラー:', error)
        alert('公開状態の更新に失敗しました。')
        return
      }

      // ローカル状態を更新
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, is_published: !currentStatus }
          : review
      ))

      const action = !currentStatus ? '公開' : '非公開'
      alert(`レビューを${action}に設定しました。`)
    } catch (error) {
      console.error('公開状態更新エラー:', error)
      alert('公開状態の更新に失敗しました。')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    window.location.href = '/admin'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  const publishedReviews = reviews.filter(r => r.is_published)
  const unpublishedReviews = reviews.filter(r => !r.is_published)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
              <p className="text-gray-600">管理者ダッシュボード</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">総レビュー数</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">公開中</p>
                <p className="text-2xl font-bold text-gray-900">{publishedReviews.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EyeOff className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">未公開</p>
                <p className="text-2xl font-bold text-gray-900">{unpublishedReviews.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* レビュー一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">受信レビュー</h2>
            <p className="text-sm text-gray-600">
              お客様からのレビューを確認し、公開・非公開を管理できます
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">まだレビューが投稿されていません。</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* レビュアー情報 */}
                      <div className="flex items-center mb-2">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {review.reviewer_name || '匿名'}
                        </span>
                        <div className="flex items-center ml-4">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* 評価 */}
                      <div className="mb-3">
                        {renderStars(review.rating)}
                      </div>

                      {/* レビュー内容 */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>

                    {/* 公開制御ボタン */}
                    <div className="ml-6 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(review.id, review.is_published)}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          review.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {review.is_published ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            公開中
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            非公開
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}