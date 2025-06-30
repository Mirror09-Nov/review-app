export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          phone: string
          address: string | null
          description: string | null
          google_place_id: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address?: string | null
          description?: string | null
          google_place_id?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          address?: string | null
          description?: string | null
          google_place_id?: string | null
          latitude?: number | null
          longitude?: number | null
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          store_id: string
          reviewer_name: string | null
          rating: number
          content: string
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          reviewer_name?: string | null
          rating: number
          content: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          reviewer_name?: string | null
          rating?: number
          content?: string
          is_published?: boolean
          published_at?: string | null
          updated_at?: string
        }
      }
    }
  }
}