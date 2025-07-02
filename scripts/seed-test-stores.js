/**
 * テスト用店舗データのシードスクリプト
 * 
 * 使用方法:
 * 1. Supabaseの環境変数を設定
 * 2. node scripts/seed-test-stores.js を実行
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase環境変数が設定されていません')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const testStores = [
  {
    name: 'カフェ・ド・クロード',
    phone: 'test-cafe-001',
    address: '東京都渋谷区代々木1-1-1',
    description: 'AI開発者が集まる隠れ家的カフェ。最高のコーヒーとコードレビューを提供。',
    google_place_id: null,
    latitude: 35.6895,
    longitude: 139.7006
  },
  {
    name: 'レストラン・プログラミング',
    phone: 'test-restaurant-002', 
    address: '東京都港区六本木1-2-3',
    description: 'アルゴリズム料理とデータ構造デザートが自慢のレストラン。',
    google_place_id: null,
    latitude: 35.6762,
    longitude: 139.7379
  },
  {
    name: 'バー・デバッグ',
    phone: 'test-bar-003',
    address: '東京都新宿区歌舞伎町2-3-4',
    description: 'バグ修正後のお疲れ様会に最適。カクテル名は全て技術用語。',
    google_place_id: null,
    latitude: 35.6960,
    longitude: 139.7036
  },
  {
    name: 'ベーカリー・ビルド',
    phone: 'test-bakery-004',
    address: '東京都世田谷区三軒茶屋5-6-7',
    description: 'CI/CDパンとDockerコンテナクロワッサンが人気。朝の開発前に最適。',
    google_place_id: null,
    latitude: 35.6433,
    longitude: 139.6690
  },
  {
    name: 'ラーメン・リファクタリング',
    phone: 'test-ramen-005',
    address: '東京都豊島区池袋8-9-10',
    description: 'コードをきれいにした後のご褒美ラーメン。麺とスープの最適化が絶妙。',
    google_place_id: null,
    latitude: 35.7295,
    longitude: 139.7109
  }
]

async function seedTestStores() {
  console.log('🌱 テスト用店舗データを作成中...')
  
  try {
    // 既存のテストデータを削除
    console.log('🧹 既存のテストデータをクリーンアップ中...')
    const { error: deleteError } = await supabase
      .from('stores')
      .delete()
      .like('phone', 'test-%')
    
    if (deleteError) {
      console.warn('⚠️ 既存データの削除でエラー（初回実行時は正常）:', deleteError.message)
    }

    // 新しいテスト店舗を挿入
    console.log('📝 新しいテスト店舗を挿入中...')
    const { data, error } = await supabase
      .from('stores')
      .insert(testStores)
      .select()

    if (error) {
      console.error('❌ 店舗データの挿入に失敗:', error)
      return
    }

    console.log('✅ テスト店舗の作成が完了しました！')
    console.log(`📊 作成された店舗数: ${data.length}`)
    
    console.log('\n📋 作成された店舗一覧:')
    data.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name}`)
      console.log(`   住所: ${store.address}`)
      console.log(`   管理用電話: ${store.phone}`)
      console.log('')
    })

    console.log('🎯 管理者認証のテスト手順:')
    console.log('1. http://localhost:3000/admin にアクセス')
    console.log('2. 店舗名に上記のいずれかを入力')
    console.log('3. 管理者名: テスト管理者（任意）')
    console.log('4. 電話番号: 090-1234-5678（任意の番号）')
    console.log('5. 認証コードはコンソールに表示されます')

  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
  }
}

// スクリプト実行
seedTestStores()