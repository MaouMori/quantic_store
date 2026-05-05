import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
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
  orders: Order[]
  coupons: Coupon[]
  customers: Customer[]
  activities: Activity[]
  banners: Banner[]
  roles: Role[]
  adminProducts: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  addOrder: (order: Omit<Order, 'id'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  addCoupon: (coupon: Omit<Coupon, 'id' | 'uses'>) => void
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent'>) => void
  addActivity: (activity: Omit<Activity, 'id'>) => void
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt'>) => void
  updateBanner: (id: string, banner: Partial<Banner>) => void
  deleteBanner: (id: string) => void
  addRole: (role: Omit<Role, 'id'>) => void
  updateRole: (id: string, role: Partial<Role>) => void
  deleteRole: (id: string) => void
}

const defaultOrders: Order[] = [
  { id: '#10234', customer: 'ana.silva', customerAvatar: '/avatars/avatar1.jpg', date: '05/05/2024 14:32', status: 'concluido', total: 159.80, items: [{ productId: 1, name: 'Conjunto Rebel Girl', price: 89.90, quantity: 1 }, { productId: 2, name: 'Top Dark Lace', price: 29.90, quantity: 1 }] },
  { id: '#10233', customer: 'moon.princess', customerAvatar: '/avatars/avatar2.jpg', date: '05/05/2024 13:15', status: 'concluido', total: 89.90, items: [{ productId: 1, name: 'Conjunto Rebel Girl', price: 89.90, quantity: 1 }] },
  { id: '#10232', customer: 'dark.doll', customerAvatar: '/avatars/avatar3.jpg', date: '05/05/2024 11:47', status: 'em_processamento', total: 129.70, items: [{ productId: 3, name: 'Calca Cargo Chains', price: 49.90, quantity: 1 }, { productId: 9, name: 'Conjunto Rebel Girl', price: 89.90, quantity: 1 }] },
  { id: '#10231', customer: 'rebel.girl', customerAvatar: '/avatars/avatar4.jpg', date: '05/05/2024 10:21', status: 'pago', total: 39.90, items: [{ productId: 10, name: 'Mochila Kawaii Dark', price: 39.90, quantity: 1 }] },
  { id: '#10230', customer: 'chaos.baby', customerAvatar: '/avatars/avatar5.jpg', date: '05/05/2024 09:08', status: 'cancelado', total: 15.90, items: [{ productId: 13, name: 'Cabelo Half & Half', price: 15.90, quantity: 1 }] },
]

const defaultCoupons: Coupon[] = [
  { id: '1', code: 'QUANTIC10', discount: 10, type: 'percent', minPurchase: 50, maxUses: 100, uses: 45, expiresAt: '2024-12-31', active: true },
  { id: '2', code: 'BEMVINDO', discount: 15, type: 'percent', maxUses: 50, uses: 23, expiresAt: '2024-06-30', active: true },
  { id: '3', code: 'FRETE0', discount: 5, type: 'fixed', maxUses: 200, uses: 89, active: false },
]

const defaultCustomers: Customer[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@email.com', avatar: '/avatars/avatar1.jpg', discord: 'ana.silva', totalOrders: 12, totalSpent: 1247.50, joinedAt: '2024-01-15', status: 'ativo' },
  { id: '2', name: 'Moon Princess', email: 'moon@email.com', avatar: '/avatars/avatar2.jpg', discord: 'moon.princess', totalOrders: 8, totalSpent: 856.30, joinedAt: '2024-02-20', status: 'ativo' },
  { id: '3', name: 'Dark Doll', email: 'dark@email.com', avatar: '/avatars/avatar3.jpg', discord: 'dark.doll', totalOrders: 5, totalSpent: 432.10, joinedAt: '2024-03-10', status: 'ativo' },
]

const defaultActivities: Activity[] = [
  { id: '1', type: 'order', message: 'Novo pedido #10234', date: '05/05/2024 14:32' },
  { id: '2', type: 'product', message: 'Produto "Conjunto Rebel Girl" atualizado', date: '05/05/2024 13:58' },
  { id: '3', type: 'customer', message: 'Novo cliente cadastrado: ana.silva', date: '05/05/2024 13:15' },
  { id: '4', type: 'banner', message: 'Banner "Colecao Dark" publicado', date: '05/05/2024 12:47' },
  { id: '5', type: 'price', message: 'Valor do produto "Top Dark Lace" alterado', date: '05/05/2024 11:22' },
]

const defaultBanners: Banner[] = [
  { id: '1', title: 'Colecao Dark', image: '/banners/dark-collection.jpg', link: '/colecoes', position: 'home', active: true, createdAt: '2024-05-01' },
]

const defaultRoles: Role[] = [
  { id: '1', name: 'Administrador', color: '#ff2d95', permissions: ['all'] },
  { id: '2', name: 'Moderador', color: '#b347d9', permissions: ['products', 'orders', 'users', 'content'] },
  { id: '3', name: 'Suporte', color: '#4488ff', permissions: ['orders', 'users'] },
  { id: '4', name: 'Designer', color: '#44ff88', permissions: ['banners', 'pages', 'media'] },
  { id: '5', name: 'Cliente VIP', color: '#ffdd44', permissions: ['panel_limited'] },
]

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(defaultOrders)
  const [coupons, setCoupons] = useState<Coupon[]>(defaultCoupons)
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers)
  const [activities, setActivities] = useState<Activity[]>(defaultActivities)
  const [banners, setBanners] = useState<Banner[]>(defaultBanners)
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [adminProducts, setAdminProducts] = useState<Product[]>([])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now() }
    setAdminProducts(prev => [...prev, newProduct])
  }, [])

  const updateProduct = useCallback((id: number, product: Partial<Product>) => {
    setAdminProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p))
  }, [])

  const deleteProduct = useCallback((id: number) => {
    setAdminProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: `#${Date.now()}` }
    setOrders(prev => [newOrder, ...prev])
  }, [])

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }, [])

  const addCoupon = useCallback((coupon: Omit<Coupon, 'id' | 'uses'>) => {
    const newCoupon = { ...coupon, id: Date.now().toString(), uses: 0 }
    setCoupons(prev => [...prev, newCoupon])
  }, [])

  const updateCoupon = useCallback((id: string, coupon: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...coupon } : c))
  }, [])

  const deleteCoupon = useCallback((id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id))
  }, [])

  const addCustomer = useCallback((customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent'>) => {
    const newCustomer = { ...customer, id: Date.now().toString(), totalOrders: 0, totalSpent: 0 }
    setCustomers(prev => [...prev, newCustomer])
  }, [])

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: Date.now().toString() }
    setActivities(prev => [newActivity, ...prev])
  }, [])

  const addBanner = useCallback((banner: Omit<Banner, 'id' | 'createdAt'>) => {
    const newBanner = { ...banner, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setBanners(prev => [...prev, newBanner])
  }, [])

  const updateBanner = useCallback((id: string, banner: Partial<Banner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...banner } : b))
  }, [])

  const deleteBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id))
  }, [])

  const addRole = useCallback((role: Omit<Role, 'id'>) => {
    const newRole = { ...role, id: Date.now().toString() }
    setRoles(prev => [...prev, newRole])
  }, [])

  const updateRole = useCallback((id: string, role: Partial<Role>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...role } : r))
  }, [])

  const deleteRole = useCallback((id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id))
  }, [])

  return (
    <AdminContext.Provider
      value={{
        orders, coupons, customers, activities, banners, roles, adminProducts,
        addProduct, updateProduct, deleteProduct,
        addOrder, updateOrderStatus,
        addCoupon, updateCoupon, deleteCoupon,
        addCustomer, addActivity,
        addBanner, updateBanner, deleteBanner,
        addRole, updateRole, deleteRole,
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
