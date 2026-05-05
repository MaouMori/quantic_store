import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2, Ticket, Tag, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    appliedCoupon,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    totalItems,
    subtotalPrice,
    discountAmount,
    totalPrice,
  } = useCart()

  const { coupons } = useAdmin()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')

    if (!couponCode.trim()) {
      setCouponError('Digite um codigo de cupom.')
      return
    }

    const found = coupons.find(
      c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active
    )

    if (!found) {
      setCouponError('Cupom invalido ou expirado.')
      return
    }

    if (found.maxUses && found.uses >= found.maxUses) {
      setCouponError('Este cupom atingiu o limite de usos.')
      return
    }

    if (found.minPurchase && subtotalPrice < found.minPurchase) {
      setCouponError(
        `Valor minimo de compra: R$ ${found.minPurchase.toFixed(2).replace('.', ',')}`
      )
      return
    }

    applyCoupon({
      code: found.code,
      discount: found.discount,
      type: found.type,
    })

    setCouponSuccess(
      `Cupom ${found.code} aplicado! ${
        found.type === 'percent'
          ? `${found.discount}% de desconto`
          : `R$ ${found.discount.toFixed(2).replace('.', ',')} de desconto`
      }`
    )
    setCouponCode('')
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-void-light border-l border-neon-pink/10 z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-neon-pink/10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neon-pink" />
              <h2 className="font-heading font-bold text-lg text-text-main">Carrinho</h2>
              {totalItems > 0 && (
                <span className="bg-neon-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-neon-pink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-text-dim mb-4" />
                <p className="text-text-muted font-heading">Seu carrinho esta vazio</p>
                <p className="text-text-dim text-sm mt-1">Adicione alguns itens! ✨</p>
              </div>
            ) : (
              <>
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-void-lighter border border-neon-pink/5"
                  >
                    <div className="w-16 h-16 rounded-lg bg-void overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <span class="text-xl">💇‍♀️</span>
                            </div>
                          `
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-sm text-text-main truncate">
                        {item.name}
                      </h3>
                      <p className="text-neon-pink font-bold text-sm mt-0.5">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-void border border-neon-pink/20 flex items-center justify-center text-text-muted hover:text-neon-pink transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-text-main font-mono text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-void border border-neon-pink/20 flex items-center justify-center text-text-muted hover:text-neon-pink transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto p-1 text-text-dim hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Section */}
                <div className="pt-2">
                  <p className="text-xs font-heading font-bold text-text-main tracking-wider mb-2 flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-neon-pink" />
                    CUPOM DE DESCONTO
                  </p>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-neon-pink" />
                        <div>
                          <p className="text-sm font-bold text-neon-pink">{appliedCoupon.code}</p>
                          <p className="text-[10px] text-text-dim">
                            {appliedCoupon.type === 'percent'
                              ? `${appliedCoupon.discount}% de desconto`
                              : `R$ ${appliedCoupon.discount.toFixed(2).replace('.', ',')} de desconto`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-text-dim hover:text-red-400 text-xs"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => {
                          setCouponCode(e.target.value)
                          setCouponError('')
                          setCouponSuccess('')
                        }}
                        placeholder="Digite o codigo"
                        className="flex-1 bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 text-sm uppercase"
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 text-neon-pink px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-red-400 text-xs mt-1">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {couponSuccess}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-neon-pink/10 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text-main">
                    R$ {subtotalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neon-pink">Desconto ({appliedCoupon.code})</span>
                    <span className="text-neon-pink">
                      - R$ {discountAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neon-pink/10">
                  <span className="text-text-main font-bold">Total</span>
                  <span className="font-heading font-bold text-xl text-neon-pink">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button className="w-full bg-neon-pink hover:bg-hot-pink text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all">
                FINALIZAR COMPRA
              </button>

              <button
                onClick={clearCart}
                className="w-full text-text-dim hover:text-red-400 text-sm py-2 transition-colors"
              >
                Limpar carrinho
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
