import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Tag,
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import type { Coupon } from '../../context/AdminContext'

export default function AdminCupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const ITEMS_PER_PAGE = 10

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSave = (coupon: Coupon) => {
    if (isCreating) {
      addCoupon({
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type,
        minPurchase: coupon.minPurchase,
        maxUses: coupon.maxUses,
        expiresAt: coupon.expiresAt,
        active: coupon.active,
      })
      setIsCreating(false)
    } else if (editing) {
      updateCoupon(coupon.id, coupon)
      setEditing(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      deleteCoupon(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Cupons</h1>
          <p className="text-text-dim text-sm">Gerencie cupons de desconto</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-neon-pink hover:bg-hot-pink text-white px-4 py-2 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo cupom
        </button>
      </div>

      <div className="review-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="Buscar cupons..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Codigo</th>
                <th className="pb-3">Desconto</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Usos</th>
                <th className="pb-3">Validade</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginated.map(coupon => (
                <tr
                  key={coupon.id}
                  className="border-t border-neon-pink/5 hover:bg-void-lighter/30 transition-colors"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-neon-pink" />
                      <span className="font-mono font-bold text-text-main">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="py-3 text-neon-pink font-semibold">
                    {coupon.type === 'percent'
                      ? `${coupon.discount}%`
                      : `R$ ${coupon.discount.toFixed(2).replace('.', ',')}`}
                  </td>
                  <td className="py-3 text-text-dim capitalize">
                    {coupon.type === 'percent' ? 'Porcentagem' : 'Valor fixo'}
                  </td>
                  <td className="py-3 text-text-dim">
                    {coupon.uses} / {coupon.maxUses || '∞'}
                  </td>
                  <td className="py-3 text-text-dim">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString('pt-BR')
                      : 'Sem validade'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        coupon.active
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {coupon.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditing(coupon)}
                        className="p-1.5 text-text-dim hover:text-neon-pink transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 text-text-dim hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || isCreating) && (
        <CouponModal
          coupon={editing}
          onSave={handleSave}
          onClose={() => {
            setEditing(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

function CouponModal({
  coupon,
  onSave,
  onClose,
}: {
  coupon: Coupon | null
  onSave: (c: Coupon) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Partial<Coupon>>(
    coupon || {
      code: '',
      discount: 10,
      type: 'percent',
      minPurchase: 0,
      maxUses: 100,
      expiresAt: '',
      active: true,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(form as Coupon),
      id: coupon?.id || Date.now().toString(),
      uses: coupon?.uses || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg review-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text-main">
            {coupon ? 'Editar Cupom' : 'Novo Cupom'}
          </h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Codigo</label>
              <input
                type="text"
                value={form.code || ''}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="QUANTIC10"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Desconto</label>
              <input
                type="number"
                value={form.discount || 0}
                onChange={e => setForm({ ...form, discount: Number(e.target.value) })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Tipo</label>
              <select
                value={form.type || 'percent'}
                onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
              >
                <option value="percent">Porcentagem (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Minimo de compra</label>
              <input
                type="number"
                step="0.01"
                value={form.minPurchase || 0}
                onChange={e => setForm({ ...form, minPurchase: Number(e.target.value) })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Limite de usos</label>
              <input
                type="number"
                value={form.maxUses || ''}
                onChange={e => setForm({ ...form, maxUses: Number(e.target.value) || undefined })}
                placeholder="Ilimitado"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Validade</label>
              <input
                type="date"
                value={form.expiresAt || ''}
                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active || false}
              onChange={e => setForm({ ...form, active: e.target.checked })}
              className="accent-neon-pink"
            />
            <span className="text-sm text-text-muted">Cupom ativo</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-muted hover:text-text-main transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-neon-pink hover:bg-hot-pink text-white px-6 py-2 rounded-lg font-heading font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
