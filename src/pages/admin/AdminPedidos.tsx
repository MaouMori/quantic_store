import { useState } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  Trash2,
  Save,
  Copy,
  MessageCircle,
} from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'
import type { Order } from '../../context/AdminContext'
import { AdminFeedback } from '../../components/admin/AdminFeedback'

const statusOptions = [
  { value: 'concluido', label: 'Concluido', color: 'bg-green-500/10 text-green-400' },
  { value: 'em_processamento', label: 'Em processamento', color: 'bg-yellow-500/10 text-yellow-400' },
  { value: 'pago', label: 'Pago', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-500/10 text-red-400' },
]

export default function AdminPedidos() {
  const { orders, updateOrderStatus, updateOrder, deleteOrder } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState<Order | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const ITEMS_PER_PAGE = 10

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleStatusChange = async (id: string, status: Order['status']) => {
    const result = await updateOrderStatus(id, status)
    setFeedback(result.success
      ? { type: 'success', message: 'Status do pedido atualizado.' }
      : { type: 'error', message: result.error || 'Nao foi possivel atualizar o pedido.' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja apagar este pedido?')) return
    const result = await deleteOrder(id)
    setFeedback(result.success
      ? { type: 'success', message: 'Pedido apagado.' }
      : { type: 'error', message: result.error || 'Nao foi possivel apagar o pedido.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Pedidos</h1>
          <p className="text-text-dim text-sm">Gerencie todos os pedidos</p>
        </div>
      </div>

      {feedback && <AdminFeedback type={feedback.type} message={feedback.message} />}

      <div className="review-card rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main text-sm focus:outline-none focus:border-neon-pink/50"
          >
            <option value="">Todos os status</option>
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Pedido</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Discord</th>
                <th className="pb-3">Data</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginated.map(order => (
                <tr
                  key={order.id}
                  className="border-t border-neon-pink/5 hover:bg-void-lighter/30 transition-colors"
                >
                  <td className="py-3 font-mono text-text-main">{order.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-void-lighter overflow-hidden">
                        <img
                          src={order.customerAvatar}
                          alt={order.customer}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML = '<span>👤</span>'
                          }}
                        />
                      </div>
                      <span className="text-text-main">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 text-text-dim">{order.customerDiscord || '-'}</td>
                  <td className="py-3 text-text-dim">{order.date}</td>
                  <td className="py-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`text-[10px] px-2 py-0.5 rounded-full border-0 cursor-pointer ${
                        statusOptions.find(s => s.value === order.status)?.color
                      }`}
                    >
                      {statusOptions.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-neon-pink font-semibold">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(order)}
                      className="p-1.5 text-text-dim hover:text-neon-pink transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg bg-void-lighter border border-neon-pink/10 text-text-muted hover:text-neon-pink disabled:opacity-30 flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc: (number | string)[], p, i, arr) => {
                if (i > 0 && (arr[i - 1] as number) < p - 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                typeof p === 'string' ? (
                  <span key={i} className="text-text-dim px-1">{p}</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center ${
                      currentPage === p
                        ? 'bg-neon-pink text-white'
                        : 'bg-void-lighter border border-neon-pink/10 text-text-muted hover:text-neon-pink'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg bg-void-lighter border border-neon-pink/10 text-text-muted hover:text-neon-pink disabled:opacity-30 flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {editing && (
        <OrderModal
          order={editing}
          onClose={() => setEditing(null)}
          onSave={async (id, patch) => {
            const result = await updateOrder(id, patch)
            setFeedback(result.success
              ? { type: 'success', message: 'Pedido atualizado.' }
              : { type: 'error', message: result.error || 'Nao foi possivel atualizar o pedido.' })
            if (result.success) setEditing(null)
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

function OrderModal({
  order,
  onClose,
  onSave,
  onDelete,
}: {
  order: Order
  onClose: () => void
  onSave: (id: string, patch: Partial<Order>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [form, setForm] = useState({
    customer: order.customer,
    customerEmail: order.customerEmail || '',
    customerDiscord: order.customerDiscord || '',
    status: order.status,
    paymentStatus: order.paymentStatus || 'pendente',
    discordVerified: order.discordVerified || false,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await onSave(order.id, {
      customer: form.customer,
      customerEmail: form.customerEmail,
      customerDiscord: form.customerDiscord,
      status: form.status,
      paymentStatus: form.paymentStatus as Order['paymentStatus'],
      discordVerified: form.discordVerified,
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg review-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text-main">Pedido {order.id}</h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-void-lighter overflow-hidden">
              <img
                src={order.customerAvatar}
                alt={order.customer}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement!.innerHTML = '<span>👤</span>'
                }}
              />
            </div>
            <div>
              <p className="text-text-main font-semibold">{order.customer}</p>
              <p className="text-text-dim text-sm">{order.customerDiscord || 'Discord nao informado'}</p>
              <p className="text-text-dim text-sm">{order.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-neon-pink/10 pt-4">
            <input value={form.customer} onChange={event => setForm(prev => ({ ...prev, customer: event.target.value }))}
              className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm" placeholder="Cliente" />
            <input value={form.customerEmail} onChange={event => setForm(prev => ({ ...prev, customerEmail: event.target.value }))}
              className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm" placeholder="Email" />
            <div className="sm:col-span-2 grid grid-cols-[1fr_auto_auto] gap-2">
              <input value={form.customerDiscord} onChange={event => setForm(prev => ({ ...prev, customerDiscord: event.target.value }))}
                className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm" placeholder="Discord" />
              <button type="button" onClick={() => navigator.clipboard?.writeText(form.customerDiscord)}
                className="w-10 rounded-lg border border-neon-pink/20 text-neon-pink flex items-center justify-center">
                <Copy className="w-4 h-4" />
              </button>
              <a href={`https://discord.com/users/${form.customerDiscord.replace(/[<@!>]/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="w-10 rounded-lg border border-neon-pink/20 text-neon-pink flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <select value={form.status} onChange={event => setForm(prev => ({ ...prev, status: event.target.value as Order['status'] }))}
              className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm">
              {statusOptions.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
            <select value={form.paymentStatus} onChange={event => setForm(prev => ({ ...prev, paymentStatus: event.target.value as NonNullable<Order['paymentStatus']> }))}
              className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm">
              <option value="pendente">Pix pendente</option>
              <option value="pago">Pix confirmado</option>
            </select>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm text-text-muted">
              <input type="checkbox" checked={form.discordVerified} onChange={event => setForm(prev => ({ ...prev, discordVerified: event.target.checked }))} className="accent-neon-pink" />
              Discord verificado manualmente
            </label>
          </div>

          <div className="border-t border-neon-pink/10 pt-4">
            <h3 className="font-heading font-bold text-sm text-text-main mb-3">Itens</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-void-lighter/30"
                >
                  <span className="text-text-main">{item.name} x{item.quantity}</span>
                  <span className="text-neon-pink font-semibold">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neon-pink/10 pt-4 flex items-center justify-between">
            <span className="text-text-main font-bold">Total</span>
            <span className="text-xl font-bold text-neon-pink">
              R$ {order.total.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 border-t border-neon-pink/10 pt-4">
            <button onClick={() => onDelete(order.id)} className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Apagar
            </button>
            <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-neon-pink text-white disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
