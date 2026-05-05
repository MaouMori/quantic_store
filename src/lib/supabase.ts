import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Tables = {
  products: {
    id: number
    name: string
    price: number
    image: string
    images: string[]
    category: string
    subcategory?: string
    style?: string[]
    color?: string[]
    is_new: boolean
    is_bestseller: boolean
    description: string
    in_game_images?: string[]
    specs?: { label: string; value: string }[]
    created_at?: string
  }
  collections: {
    id: number
    name: string
    subtitle: string
    image: string
    color: string
    created_at?: string
  }
  banners: {
    id: string
    title: string
    image: string
    link: string
    position: 'home' | 'loja' | 'colecoes'
    active: boolean
    created_at?: string
  }
  coupons: {
    id: string
    code: string
    discount: number
    type: 'percent' | 'fixed'
    min_purchase?: number
    max_uses?: number
    uses: number
    expires_at?: string
    active: boolean
    created_at?: string
  }
  orders: {
    id: string
    customer_name: string
    customer_email: string
    customer_discord?: string
    customer_avatar?: string
    status: 'concluido' | 'em_processamento' | 'pago' | 'cancelado'
    total: number
    items: { product_id: number; name: string; price: number; quantity: number }[]
    coupon_code?: string
    discount_amount?: number
    created_at?: string
  }
  customers: {
    id: string
    name: string
    email: string
    avatar?: string
    discord?: string
    total_orders: number
    total_spent: number
    status: 'ativo' | 'inativo'
    created_at?: string
  }
  roles: {
    id: string
    name: string
    color: string
    permissions: string[]
    created_at?: string
  }
  profiles: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
    role_color: string
    permissions: string[]
    created_at?: string
  }
}
