import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createClient = () => {
  return createClientComponentClient<Database>()
}

// サーバーサイド用のクライアント（もし必要になった場合）
export { createClientComponentClient }