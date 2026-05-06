import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Copy, FileUp, MessageCircle, QrCode, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useAdmin } from '../context/useAdmin'
import { useAuth } from '../context/useAuth'
import { createPixPayload } from '../lib/pix'

export default function Checkout() {
  const {
    items,
    appliedCoupon,
    subtotalPrice,
    discountAmount,
    totalPrice,
    clearCart,
  } = useCart()
  const { addOrder, uploadImage } = useAdmin()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [customerDiscord, setCustomerDiscord] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const pixKey = import.meta.env.VITE_PIX_KEY || ''
  const pixName = import.meta.env.VITE_PIX_NAME || 'QUANTIC STORE'
  const pixCity = import.meta.env.VITE_PIX_CITY || 'SAO PAULO'
  const orderId = useMemo(() => crypto.randomUUID(), [])
  const pixPayload = useMemo(() => createPixPayload({
    key: pixKey || 'configure-pix@quantic.store',
    name: pixName,
    city: pixCity,
    amount: totalPrice,
    txid: orderId.replace(/-/g, '').slice(0, 25),
  }), [orderId, pixCity, pixKey, pixName, totalPrice])
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(pixPayload)}`

  const handleProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file, 'payment-proofs')
    setUploading(false)
    if (url) setProofUrl(url)
    else setError('Nao foi possivel enviar o comprovante.')
  }

  const finishOrder = async () => {
    setError('')
    setSuccess('')

    if (items.length === 0) {
      setError('Seu carrinho esta vazio.')
      return
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerDiscord.trim()) {
      setError('Preencha nome, email e Discord.')
      return
    }

    if (!proofUrl) {
      setError('Envie o comprovante do Pix antes de finalizar.')
      return
    }

    setSaving(true)
    const orderPayload = {
      id: orderId,
      userId: user?.id,
      customer: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerDiscord: customerDiscord.trim(),
      customerAvatar: user?.avatar || '/avatars/default.jpg',
      date: new Date().toLocaleString('pt-BR'),
      status: 'em_processamento' as const,
      total: totalPrice,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      couponCode: appliedCoupon?.code,
      discountAmount,
      paymentMethod: 'pix' as const,
      paymentStatus: 'pendente' as const,
      paymentProofUrl: proofUrl,
    }

    const result = await addOrder(orderPayload)
    if (!result.success) {
      setError(result.error || 'Nao foi possivel criar o pedido.')
      setSaving(false)
      return
    }

    try {
      await fetch('/api/notify-discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          customer: orderPayload.customer,
          email: orderPayload.customerEmail,
          discord: orderPayload.customerDiscord,
          total: orderPayload.total,
          items: orderPayload.items,
          couponCode: orderPayload.couponCode,
          proofUrl,
        }),
      })
    } catch (notificationError) {
      console.warn('Discord notification failed:', notificationError)
    }

    clearCart()
    setSuccess('Pedido enviado! Agora vamos conferir o pagamento e entregar os arquivos pelo Discord.')
    setSaving(false)
    window.setTimeout(() => navigate('/meus-pedidos'), 2500)
  }

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-14 h-14 text-text-dim mx-auto mb-4" />
        <h1 className="font-display text-4xl text-white">CARRINHO VAZIO</h1>
        <Link to="/loja" className="inline-flex mt-5 text-neon-pink hover:text-hot-pink">Voltar para loja</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <QrCode className="w-10 h-10 text-neon-pink mx-auto mb-3" />
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">FINALIZAR PIX</h1>
        <p className="text-text-muted text-sm mt-2">Pague pelo QR Code, envie o comprovante e receba os arquivos via Discord.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="review-card rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Nome</label>
              <input value={customerName} onChange={event => setCustomerName(event.target.value)}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50" />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Email</label>
              <input type="email" value={customerEmail} onChange={event => setCustomerEmail(event.target.value)}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Discord para entrega</label>
              <input value={customerDiscord} onChange={event => setCustomerDiscord(event.target.value)}
                placeholder="@usuario ou usuario#0001"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50" />
              <p className="text-text-dim text-xs mt-2 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-neon-pink" />
                A entrega dos arquivos sera feita pelo Discord informado.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neon-pink/15 bg-void-light p-4">
            <label className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-neon-pink/30 px-4 py-3 text-neon-pink hover:bg-neon-pink/10 transition-colors">
              <FileUp className="w-5 h-5" />
              {uploading ? 'Enviando comprovante...' : proofUrl ? 'Comprovante enviado' : 'Enviar comprovante do Pix'}
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleProofUpload} />
            </label>
            {proofUrl && (
              <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="block text-green-400 text-xs mt-2 break-all">
                {proofUrl}
              </a>
            )}
          </div>

          {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>}
          {success && <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-400 text-sm">{success}</div>}

          <button onClick={finishOrder} disabled={saving || uploading}
            className="w-full bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            {saving ? 'ENVIANDO PEDIDO...' : 'ENVIAR PEDIDO'}
          </button>
        </div>

        <aside className="space-y-4">
          <div className="review-card rounded-2xl p-5 text-center">
            <img src={qrUrl} alt="QR Code Pix" className="w-64 h-64 mx-auto rounded-lg bg-white p-2" />
            <p className="text-text-dim text-xs mt-3">Escaneie o QR Code no app do seu banco.</p>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(pixPayload)}
              className="mt-3 w-full rounded-lg border border-neon-pink/30 px-4 py-2 text-neon-pink hover:bg-neon-pink hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar Pix copia e cola
            </button>
          </div>

          <div className="review-card rounded-2xl p-5">
            <h2 className="font-heading font-bold text-text-main mb-3">Resumo</h2>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-text-muted">{item.name} x{item.quantity}</span>
                  <span className="text-text-main">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-neon-pink/10 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-main">R$ {subtotalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-neon-pink">
                  <span>Desconto</span>
                  <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span className="text-text-main">Total</span>
                <span className="text-neon-pink">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
