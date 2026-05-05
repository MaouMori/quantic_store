import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables } from '../lib/supabase'
import type { Product } from '../data/storeData'

export interface Order {
  id: string
  customer: string
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

interface AdminContextType {
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
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>
  updateProduct: (id: number, product: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: number) => Promise<boolean>
  addOrder: (order: Omit<Order, 'id'>) => Promise<boolean>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>
  addCoupon: (coupon: Omit<Coupon, 'id' | 'uses'>) => Promise<boolean>
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<boolean>
  deleteCoupon: (id: string) => Promise<boolean>
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<boolean>
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<boolean>
  deleteBanner: (id: string) => Promise<boolean>
  addRole: (role: Omit<Role, 'id'>) => Promise<boolean>
  updateRole: (id: string, role: Partial<Role>) => Promise<boolean>
  deleteRole: (id: string) => Promise<boolean>
  uploadImage: (file: File, path: string) => Promise<string | null>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

function mapDbProduct(row: Tables['products']): Product {
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

function mapDbOrder(row: Tables['orders']): Order {
  return {
    id: row.id,
    customer: row.customer_name,
    customerAvatar: row.customer_avatar || '/avatars/default.jpg',
    date: new Date(row.created_at || '').toLocaleString('pt-BR'),
    status: row.status,
    total: row.total,
    items: (row.items || []).map((item: any) => ({
      productId: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  }
}

function mapDbCoupon(row: Tables['coupons']): Coupon {
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

function mapDbBanner(row: Tables['banners']): Banner {
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

function mapDbRole(row: Tables['roles']): Role {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    permissions: row.permissions || [],
  }
}

function mapDbCustomer(row: Tables['customers']): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || '/avatars/default.jpg',
    discord: row.discord || '',
    totalOrders: row.total_orders,
    totalSpent: row.total_spent,
    joinedAt: new Date(row.created_at || '').toLocaleDateString('pt-BR'),
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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setProducts(data.map(mapDbProduct))
  }, [])

  const refreshOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setOrders(data.map(mapDbOrder))
  }, [])

  const refreshCoupons = useCallback(async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCoupons(data.map(mapDbCoupon))
  }, [])

  const refreshCustomers = useCallback(async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCustomers(data.map(mapDbCustomer))
  }, [])

  const refreshBanners = useCallback(async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setBanners(data.map(mapDbBanner))
  }, [])

  const refreshRoles = useCallback(async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setRoles(data.map(mapDbRole))
  }, [])

  useEffect(() => {
    refreshProducts()
    refreshOrders()
    refreshCoupons()
    refreshCustomers()
    refreshBanners()
    refreshRoles()
  }, [refreshProducts, refreshOrders, refreshCoupons, refreshCustomers, refreshBanners, refreshRoles])

  const uploadImage = useCallback(async (file: File, path: string) => {
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
    if (!error) await refreshProducts()
    return !error
  }, [refreshProducts])

  const updateProduct = useCallback(async (id: number, product: Partial<Product>) => {
    const updateData: any = {}
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
    if (!error) await refreshProducts()
    return !error
  }, [refreshProducts])

  const deleteProduct = useCallback(async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) await refreshProducts()
    return !error
  }, [refreshProducts])

  const addOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    const { error } = await supabase.from('orders').insert({
      customer_name: order.customer,
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
    if (!error) await refreshOrders()
    return !error
  }, [refreshOrders])

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) await refreshOrders()
    return !error
  }, [refreshOrders])

  const addCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'uses'>) => {
    const { error } = await supabase.from('coupons').insert({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      min_purchase: coupon.minPurchase,
      max_uses: coupon.maxUses,
      uses: 0,
      expires_at: coupon.expiresAt,
      active: coupon.active,
    })
    if (!error) await refreshCoupons()
    return !error
  }, [refreshCoupons])

  const updateCoupon = useCallback(async (id: string, coupon: Partial<Coupon>) => {
    const updateData: any = {}
    if (coupon.code !== undefined) updateData.code = coupon.code
    if (coupon.discount !== undefined) updateData.discount = coupon.discount
    if (coupon.type !== undefined) updateData.type = coupon.type
    if (coupon.minPurchase !== undefined) updateData.min_purchase = coupon.minPurchase
    if (coupon.maxUses !== undefined) updateData.max_uses = coupon.maxUses
    if (coupon.uses !== undefined) updateData.uses = coupon.uses
    if (coupon.expiresAt !== undefined) updateData.expires_at = coupon.expiresAt
    if (coupon.active !== undefined) updateData.active = coupon.active

    const { error } = await supabase.from('coupons').update(updateData).eq('id', id)
    if (!error) await refreshCoupons()
    return !error
  }, [refreshCoupons])

  const deleteCoupon = useCallback(async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (!error) await refreshCoupons()
    return !error
  }, [refreshCoupons])

  const addBanner = useCallback(async (banner: Omit<Banner, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('banners').insert({
      title: banner.title,
      image: banner.image,
      link: banner.link,
      position: banner.position,
      active: banner.active,
    })
    if (!error) await refreshBanners()
    return !error
  }, [refreshBanners])

  const updateBanner = useCallback(async (id: string, banner: Partial<Banner>) => {
    const updateData: any = {}
    if (banner.title !== undefined) updateData.title = banner.title
    if (banner.image !== undefined) updateData.image = banner.image
    if (banner.link !== undefined) updateData.link = banner.link
    if (banner.position !== undefined) updateData.position = banner.position
    if (banner.active !== undefined) updateData.active = banner.active

    const { error } = await supabase.from('banners').update(updateData).eq('id', id)
    if (!error) await refreshBanners()
    return !error
  }, [refreshBanners])

  const deleteBanner = useCallback(async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (!error) await refreshBanners()
    return !error
  }, [refreshBanners])

  const addRole = useCallback(async (role: Omit<Role, 'id'>) => {
    const { error } = await supabase.from('roles').insert({
      name: role.name,
      color: role.color,
      permissions: role.permissions,
    })
    if (!error) await refreshRoles()
    return !error
  }, [refreshRoles])

  const updateRole = useCallback(async (id: string, role: Partial<Role>) => {
    const updateData: any = {}
    if (role.name !== undefined) updateData.name = role.name
    if (role.color !== undefined) updateData.color = role.color
    if (role.permissions !== undefined) updateData.permissions = role.permissions

    const { error } = await supabase.from('roles').update(updateData).eq('id', id)
    if (!error) await refreshRoles()
    return !error
  }, [refreshRoles])

  const deleteRole = useCallback(async (id: string) => {
    const { error } = await supabase.from('roles').delete().eq('id', id)
    if (!error) await refreshRoles()
    return !error
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

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
