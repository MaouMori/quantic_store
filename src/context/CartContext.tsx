import { useState, useCallback, type ReactNode } from 'react'
import { CartContext } from './cartContextValue'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export interface AppliedCoupon {
  code: string
  discount: number
  type: 'percent' | 'fixed'
}

export interface CartContextType {
  items: CartItem[]
  appliedCoupon: AppliedCoupon | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  totalItems: number
  subtotalPrice: number
  discountAmount: number
  totalPrice: number
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === newItem.id)
      if (existing) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== id))
    } else {
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedCoupon(null)
  }, [])

  const applyCoupon = useCallback((coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon)
  }, [])

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? subtotalPrice * (appliedCoupon.discount / 100)
      : Math.min(appliedCoupon.discount, subtotalPrice)
    : 0

  const totalPrice = Math.max(0, subtotalPrice - discountAmount)

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        totalItems,
        subtotalPrice,
        discountAmount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
