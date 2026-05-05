import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables } from '../lib/supabase'
import type { Product } from '../data/storeData'
import { AdminContext } from './adminContextValue'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export interface Order {
  id: string
  customer: string
  customerEmail?: string
  customerAvatar: string
  date: string
  status: 'concluido' | 'em_processamento' | 'pago' | 'cancelado'
  total: number
  items: { productId: number; name: string; price: number; quantity: number }[]
}

export interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percent' | 'fixed'
  minPurchase?: number
  maxUses?: number
  uses: number
  expiresAt?: string
  active: boolean
}

export interface Customer {
  id: string
  name: string
  email: string
  avatar: string
  discord: string
  totalOrders: number
  totalSpent: number
  joinedAt: string
  status: 'ativo' | 'inativo'
}

export interface Activity {
  id: string
  type: 'order' | 'product' | 'customer' | 'banner' | 'coupon' | 'price'
  message: string
  date: string
}

export interface Banner {
  id: string
  title: string
  image: string
  link: string
  position: 'home' | 'loja' | 'colecoes'
  active: boolean
  createdAt: string
}

export interface Role {
  id: string
  name: string
  color: string
  permissions: string[]
}

export interface AdminActionResult {
  success: boolean
  error?: string
}

export interface AdminContextType {
  products: Product[]
  collections: Product[]
  orders: Order[]
  coupons: Coupon[]
  customers: Customer[]
  activities: Activity[]
  banners: Banner[]
  roles: Role[]
  isLoading: boolean
  refreshProducts: () => Promise<void>
  refreshCollections: () => Promise<void>
  refreshOrders: () => Promise<void>
  refreshCoupons: () => Promise<void>
  refreshCustomers: () => Promise<void>
  refreshBanners: () => Promise<void>
  refreshRoles: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<AdminActionResult>
  updateProduct: (id: number, product: Partial<Product>) => Promise<AdminActionResult>
  deleteProduct: (id: number) => Promise<AdminActionResult>
  addOrder: (order: Omit<Order, 'id'>) => Promise<AdminActionResult>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<AdminActionResult>
  addCoupon: (coupon: Omit<Coupon, 'id' | 'uses'>) => Promise<AdminActionResult>
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<AdminActionResult>
  deleteCoupon: (id: string) => Promise<AdminActionResult>
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<AdminActionResult>
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<AdminActionResult>
  deleteBanner: (id: string) => Promise<AdminActionResult>
  addRole: (role: Omit<Role, 'id'>) => Promise<AdminActionResult>
  updateRole: (id: string, role: Partial<Role>) => Promise<AdminActionResult>
  deleteRole: (id: string) => Promise<AdminActionResult>
  uploadImage: (file: File, path: string) => Promise<string | null>
}

type ProductRow = Tables['products']
type OrderRow = Tables['orders']
type OrderItemRow = OrderRow['items'][number]
type CouponRow = Tables['coupons']
type BannerRow = Tables['banners']
type RoleRow = Tables['roles']
type CustomerRow = Tables['customers']

const notConfigured = (): AdminActionResult => ({
  success: false,
  error: 'Supabase nao configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
})

const ok = (): AdminActionResult => ({ success: true })

const fail = (message?: string): AdminActionResult => ({
  success: false,
  error: message || 'Operacao nao concluida no Supabase.',
})

function mapDbProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    image: row.image,
    images: row.images || [],
    category: row.category,
    subcategory: row.subcategory,
    style: row.style || [],
    color: row.color || [],
    isNew: row.is_new,
    isBestseller: row.is_bestseller,
    description: row.description,
    inGameImages: row.in_game_images || [],
    specs: row.specs || [],
  }
}

function mapDbOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customer: row.customer_name,
    customerAvatar: row.customer_avatar || '/avatars/default.jpg',
    date: row.created_at ? new Date(row.created_at).toLocaleString('pt-BR') : '',
    status: row.status,
    total: row.total,
    items: (row.items || []).map((item: OrderItemRow) => ({
      productId: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  }
}

function mapDbCoupon(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    discount: row.discount,
    type: row.type,
    minPurchase: row.min_purchase,
    maxUses: row.max_uses,
    uses: row.uses,
    expiresAt: row.expires_at,
    active: row.active,
  }
}

function mapDbBanner(row: BannerRow): Banner {
  return {
    id: row.id,
    title: row.title,
    image: row.image,
    link: row.link,
    position: row.position,
    active: row.active,
    createdAt: row.created_at || new Date().toISOString(),
  }
}

function mapDbRole(row: RoleRow): Role {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    permissions: row.permissions || [],
  }
}

function mapDbCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || '/avatars/default.jpg',
    discord: row.discord || '',
    totalOrders: row.total_orders,
    totalSpent: row.total_spent,
    joinedAt: row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : '',
    status: row.status,
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [activities] = useState<Activity[]>([])
  const [isLoading] = useState(false)

  const refreshProducts = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setProducts(data.map(mapDbProduct))
  }, [])

  const refreshOrders = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setOrders(data.map(mapDbOrder))
  }, [])

  const refreshCoupons = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCoupons(data.map(mapDbCoupon))
  }, [])

  const refreshCustomers = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCustomers(data.map(mapDbCustomer))
  }, [])

  const refreshBanners = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setBanners(data.map(mapDbBanner))
  }, [])

  const refreshRoles = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setRoles(data.map(mapDbRole))
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Promise.all([
        refreshProducts(),
        refreshOrders(),
        refreshCoupons(),
        refreshCustomers(),
        refreshBanners(),
        refreshRoles(),
      ])
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [refreshProducts, refreshOrders, refreshCoupons, refreshCustomers, refreshBanners, refreshRoles])

  const uploadImage = useCallback(async (file: File, path: string) => {
    if (!isSupabaseConfigured()) {
      console.error('Supabase nao configurado para upload de imagens')
      return null
    }
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    return data.publicUrl
  }, [])

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('products').insert({
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images || [],
      category: product.category,
      subcategory: product.subcategory,
      style: product.style || [],
      color: product.color || [],
      is_new: product.isNew,
      is_bestseller: product.isBestseller,
      description: product.description,
      in_game_images: product.inGameImages || [],
      specs: product.specs || [],
    })
    if (error) return fail(error.message)
    await refreshProducts()
    return ok()
  }, [refreshProducts])

  const updateProduct = useCallback(async (id: number, product: Partial<Product>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const updateData: Partial<ProductRow> = {}
    if (product.name !== undefined) updateData.name = product.name
    if (product.price !== undefined) updateData.price = product.price
    if (product.image !== undefined) updateData.image = product.image
    if (product.images !== undefined) updateData.images = product.images
    if (product.category !== undefined) updateData.category = product.category
    if (product.subcategory !== undefined) updateData.subcategory = product.subcategory
    if (product.style !== undefined) updateData.style = product.style
    if (product.color !== undefined) updateData.color = product.color
    if (product.isNew !== undefined) updateData.is_new = product.isNew
    if (product.isBestseller !== undefined) updateData.is_bestseller = product.isBestseller
    if (product.description !== undefined) updateData.description = product.description
    if (product.inGameImages !== undefined) updateData.in_game_images = product.inGameImages
    if (product.specs !== undefined) updateData.specs = product.specs

    const { error } = await supabase.from('products').update(updateData).eq('id', id)
    if (error) return fail(error.message)
    await refreshProducts()
    return ok()
  }, [refreshProducts])

  const deleteProduct = useCallback(async (id: number) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return fail(error.message)
    await refreshProducts()
    return ok()
  }, [refreshProducts])

  const addOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('orders').insert({
      id: crypto.randomUUID(),
      customer_name: order.customer,
      customer_email: order.customerEmail || 'cliente@teste.local',
      customer_avatar: order.customerAvatar,
      status: order.status,
      total: order.total,
      items: order.items.map(i => ({
        product_id: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    })
    if (error) return fail(error.message)
    await refreshOrders()
    return ok()
  }, [refreshOrders])

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) return fail(error.message)
    await refreshOrders()
    return ok()
  }, [refreshOrders])

  const addCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'uses'>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('coupons').insert({
      id: crypto.randomUUID(),
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      min_purchase: coupon.minPurchase,
      max_uses: coupon.maxUses,
      uses: 0,
      expires_at: coupon.expiresAt,
      active: coupon.active,
    })
    if (error) return fail(error.message)
    await refreshCoupons()
    return ok()
  }, [refreshCoupons])

  const updateCoupon = useCallback(async (id: string, coupon: Partial<Coupon>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const updateData: Partial<CouponRow> = {}
    if (coupon.code !== undefined) updateData.code = coupon.code
    if (coupon.discount !== undefined) updateData.discount = coupon.discount
    if (coupon.type !== undefined) updateData.type = coupon.type
    if (coupon.minPurchase !== undefined) updateData.min_purchase = coupon.minPurchase
    if (coupon.maxUses !== undefined) updateData.max_uses = coupon.maxUses
    if (coupon.uses !== undefined) updateData.uses = coupon.uses
    if (coupon.expiresAt !== undefined) updateData.expires_at = coupon.expiresAt
    if (coupon.active !== undefined) updateData.active = coupon.active

    const { error } = await supabase.from('coupons').update(updateData).eq('id', id)
    if (error) return fail(error.message)
    await refreshCoupons()
    return ok()
  }, [refreshCoupons])

  const deleteCoupon = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (error) return fail(error.message)
    await refreshCoupons()
    return ok()
  }, [refreshCoupons])

  const addBanner = useCallback(async (banner: Omit<Banner, 'id' | 'createdAt'>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('banners').insert({
      id: crypto.randomUUID(),
      title: banner.title,
      image: banner.image,
      link: banner.link,
      position: banner.position,
      active: banner.active,
    })
    if (error) return fail(error.message)
    await refreshBanners()
    return ok()
  }, [refreshBanners])

  const updateBanner = useCallback(async (id: string, banner: Partial<Banner>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const updateData: Partial<BannerRow> = {}
    if (banner.title !== undefined) updateData.title = banner.title
    if (banner.image !== undefined) updateData.image = banner.image
    if (banner.link !== undefined) updateData.link = banner.link
    if (banner.position !== undefined) updateData.position = banner.position
    if (banner.active !== undefined) updateData.active = banner.active

    const { error } = await supabase.from('banners').update(updateData).eq('id', id)
    if (error) return fail(error.message)
    await refreshBanners()
    return ok()
  }, [refreshBanners])

  const deleteBanner = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) return fail(error.message)
    await refreshBanners()
    return ok()
  }, [refreshBanners])

  const addRole = useCallback(async (role: Omit<Role, 'id'>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('roles').insert({
      id: crypto.randomUUID(),
      name: role.name,
      color: role.color,
      permissions: role.permissions,
    })
    if (error) return fail(error.message)
    await refreshRoles()
    return ok()
  }, [refreshRoles])

  const updateRole = useCallback(async (id: string, role: Partial<Role>) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const updateData: Partial<RoleRow> = {}
    if (role.name !== undefined) updateData.name = role.name
    if (role.color !== undefined) updateData.color = role.color
    if (role.permissions !== undefined) updateData.permissions = role.permissions

    const { error } = await supabase.from('roles').update(updateData).eq('id', id)
    if (error) return fail(error.message)
    await refreshRoles()
    return ok()
  }, [refreshRoles])

  const deleteRole = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return notConfigured()
    const { error } = await supabase.from('roles').delete().eq('id', id)
    if (error) return fail(error.message)
    await refreshRoles()
    return ok()
  }, [refreshRoles])

  return (
    <AdminContext.Provider
      value={{
        products,
        collections: [],
        orders,
        coupons,
        customers,
        activities,
        banners,
        roles,
        isLoading,
        refreshProducts,
        refreshCollections: async () => {},
        refreshOrders,
        refreshCoupons,
        refreshCustomers,
        refreshBanners,
        refreshRoles,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addBanner,
        updateBanner,
        deleteBanner,
        addRole,
        updateRole,
        deleteRole,
        uploadImage,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}
