'use client'

import { useState } from 'react'
import { Phone, Building2, Shield } from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [storeName, setStoreName] = useState('')
  const [managerName, setManagerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'login' | 'verify'>('login')
  const [verificationCode, setVerificationCode] = useState('')
  const supabase = createClientComponentClient()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 電話番号の形式を正規化（ハイフンなどを除去）
      const normalizedPhone = phoneNumber.replace(/[-\s]/g, '')
      
      // 店舗の存在確認
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, name')
        .eq('name', storeName.trim())
        .single()

      if (storeError || !store) {
        alert('指定された店舗が見つかりません。')
        return
      }

      // 管理者の存在確認または新規作成
      const { data: existingManager } = await supabase
        .from('store_managers')
        .select('id')
        .eq('store_id', store.id)
        .eq('phone_number', normalizedPhone)
        .single()

      if (!existingManager) {
        // 新規管理者作成
        const { error: managerError } = await supabase
          .from('store_managers')
          .insert({
            store_id: store.id,
            manager_name: managerName.trim(),
            phone_number: normalizedPhone,
            is_verified: false
          })

        if (managerError) {
          console.error('管理者作成エラー:', managerError)
          alert('管理者登録に失敗しました。')
          return
        }
      }

      // 認証コード生成
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10分後

      // 認証コードをデータベースに保存
      const { error: updateError } = await supabase
        .from('store_managers')
        .update({
          verification_code: code,
          verification_expires_at: expiresAt
        })
        .eq('phone_number', normalizedPhone)
        .eq('store_id', store.id)

      if (updateError) {
        console.error('認証コード保存エラー:', updateError)
        alert('認証コードの生成に失敗しました。')
        return
      }

      // SMS送信API呼び出し
      try {
        const smsResponse = await fetch('/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: normalizedPhone,
            verificationCode: code
          })
        })

        const smsResult = await smsResponse.json()
        
        if (smsResult.success) {
          // 開発環境では認証コードも表示
          if (process.env.NODE_ENV === 'development' && smsResult.code) {
            console.log(`📱 SMS認証コード（開発用）: ${smsResult.code}`)
            alert(`${smsResult.message}\n\n開発環境: 認証コード ${smsResult.code}`)
          } else {
            alert(smsResult.message)
          }
        } else {
          alert(`SMS送信に失敗: ${smsResult.message}`)
          return
        }
      } catch (smsError) {
        console.error('SMS API呼び出しエラー:', smsError)
        alert('SMS送信サービスでエラーが発生しました。')
        return
      }

      setStep('verify')
    } catch (error) {
      console.error('ログインエラー:', error)
      alert('ログインに失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const normalizedPhone = phoneNumber.replace(/[-\s]/g, '')

      // 認証コードの確認
      const { data: manager, error } = await supabase
        .from('store_managers')
        .select('id, store_id, verification_code, verification_expires_at')
        .eq('phone_number', normalizedPhone)
        .single()

      if (error || !manager) {
        alert('管理者情報が見つかりません。')
        return
      }

      // 認証コードの検証
      if (manager.verification_code !== verificationCode) {
        alert('認証コードが正しくありません。')
        return
      }

      // 期限チェック
      if (new Date(manager.verification_expires_at!) < new Date()) {
        alert('認証コードの有効期限が切れています。最初からやり直してください。')
        setStep('login')
        return
      }

      // 認証成功 - 管理者を認証済みにマーク
      const { error: verifyError } = await supabase
        .from('store_managers')
        .update({
          is_verified: true,
          verification_code: null,
          verification_expires_at: null
        })
        .eq('id', manager.id)

      if (verifyError) {
        console.error('認証更新エラー:', verifyError)
        alert('認証の更新に失敗しました。')
        return
      }

      // ダッシュボードにリダイレクト（セッション情報をローカルストレージに保存）
      localStorage.setItem('admin_session', JSON.stringify({
        managerId: manager.id,
        storeId: manager.store_id,
        phone: normalizedPhone
      }))

      window.location.href = '/admin/dashboard'
    } catch (error) {
      console.error('認証エラー:', error)
      alert('認証に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">店舗管理者ログイン</h1>
            <p className="text-gray-600 mt-2">
              レビューの管理には電話認証が必要です
            </p>
          </div>

          {step === 'login' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              {/* 店舗名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  店舗名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="あなたの店舗名を入力"
                    required
                  />
                </div>
              </div>

              {/* 管理者名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="店舗責任者のお名前"
                  required
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="090-1234-5678"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  認証コードをSMSで送信します
                </p>
              </div>

              <button
                type="submit"
                disabled={!storeName || !managerName || !phoneNumber || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? '送信中...' : '認証コードを送信'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">認証コードを入力</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {phoneNumber} に送信されたコードを入力してください
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  認証コード <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verificationCode.length !== 6 || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? '認証中...' : 'ログイン'}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full text-blue-600 hover:text-blue-700 py-2"
              >
                戻る
              </button>
            </form>
          )}

          {/* フッター */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
              一般ユーザーとしてレビューを投稿
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}