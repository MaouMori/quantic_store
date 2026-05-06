import { useEffect, useMemo, useState } from 'react'
import { PackageCheck, Search, ShoppingBag } from 'lucide-react'
import { useAdmin } from '../context/useAdmin'
import { useAuth } from '../context/useAuth'

const statusLabels = {
  em_processamento: 'Aguardando pagamento/entrega',
  pago: 'Pagamento confirmado',
  concluido: 'Concluido',
  cancelado: 'Cancelado',
}

export default function MeusPedidos() {
  const { orders } = useAdmin()
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [discord, setDiscord] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (user?.email) setEmail(user.email)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [user?.email])

  const filtered = useMemo(() => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedDiscord = discord.trim().toLowerCase()

    return orders.filter(order => {
      const byUser = user?.id && order.userId === user.id
      const byEmail = normalizedEmail && order.customerEmail?.toLowerCase() === normalizedEmail
      const byDiscord = normalizedDiscord && order.customerDiscord?.toLowerCase() === normalizedDiscord
      return byUser || byEmail || byDiscord
    })
  }, [discord, email, orders, user])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <ShoppingBag className="w-10 h-10 text-neon-pink mx-auto mb-3" />
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">MEUS PEDIDOS</h1>
        <p className="text-text-muted text-sm mt-2">Acompanhe o pagamento, processamento e entrega dos seus arquivos.</p>
      </div>

      <div className="review-card rounded-xl p-5 mb-6">
        {user && (
          <p className="text-text-muted text-sm mb-3">
            Logado como <span className="text-neon-pink">{user.name}</span>. Seus pedidos vinculados a esta conta aparecem automaticamente.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Email usado no pedido"
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50"
            />
          </div>
          <input
            type="text"
            value={discord}
            onChange={event => setDiscord(event.target.value)}
            placeholder="Discord usado no pedido"
            className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="review-card rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-neon-pink/10 pb-4 mb-4">
                <div>
                  <p className="text-xs text-text-dim font-mono">#{order.id}</p>
                  <h2 className="font-heading font-bold text-text-main mt-1">{statusLabels[order.status]}</h2>
                  <p className="text-text-dim text-sm">{order.date}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-flex rounded-full bg-neon-pink/10 text-neon-pink px-3 py-1 text-xs font-heading font-bold">
                    PIX {order.paymentStatus === 'pago' ? 'PAGO' : 'PENDENTE'}
                  </span>
                  <p className="text-neon-pink font-bold text-lg mt-2">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between rounded-lg bg-void-lighter/40 px-3 py-2">
                    <span className="text-text-main text-sm">{item.name} x{item.quantity}</span>
                    <span className="text-text-muted text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 rounded-xl border border-neon-pink/10 bg-void-light">
          <PackageCheck className="w-12 h-12 text-text-dim mx-auto mb-3" />
          <p className="text-text-muted">Nenhum pedido encontrado com esses dados.</p>
        </div>
      )}
    </div>
  )
}
