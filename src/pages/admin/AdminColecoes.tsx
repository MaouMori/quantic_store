import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'
import type { StoreCollection } from '../../context/AdminContext'
import { AdminFeedback } from '../../components/admin/AdminFeedback'

const emptyCollection: Omit<StoreCollection, 'id' | 'createdAt'> = {
  name: '',
  subtitle: '',
  image: '',
  color: '#ff2d95',
  price: 0,
  discountPercent: 0,
  active: true,
  productIds: [],
}

export default function AdminColecoes() {
  const {
    products,
    storeCollections,
    addStoreCollection,
    updateStoreCollection,
    deleteStoreCollection,
  } = useAdmin()
  const [editing, setEditing] = useState<StoreCollection | null>(null)
  const [creating, setCreating] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta colecao?')) return
    const result = await deleteStoreCollection(id)
    setFeedback(result.success
      ? { type: 'success', message: 'Colecao excluida com sucesso.' }
      : { type: 'error', message: result.error || 'Nao foi possivel excluir a colecao.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Colecoes</h1>
          <p className="text-text-dim text-sm">{storeCollections.length} colecoes cadastradas</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-neon-pink hover:bg-hot-pink text-white px-4 py-2 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova colecao
        </button>
      </div>

      {feedback && <AdminFeedback type={feedback.type} message={feedback.message} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {storeCollections.map(collection => {
          const linkedProducts = products.filter(product =>
            product.collectionId === collection.id || collection.productIds.includes(product.id)
          )
          const finalPrice = collection.price * (1 - Math.min(100, Math.max(0, collection.discountPercent)) / 100)
          return (
            <div key={collection.id} className="review-card rounded-xl overflow-hidden">
              <div className="relative h-44 bg-void-lighter">
                <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="font-display text-3xl tracking-wide" style={{ color: collection.color }}>{collection.name}</h2>
                  <p className="text-text-muted text-sm line-clamp-2">{collection.subtitle}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neon-pink font-heading font-bold">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </p>
                    {collection.discountPercent > 0 && (
                      <p className="text-text-dim text-xs">Base R$ {collection.price.toFixed(2).replace('.', ',')} - {collection.discountPercent}% off</p>
                    )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${collection.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {collection.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <p className="text-text-dim text-xs">
                  Produtos: {linkedProducts.length > 0 ? linkedProducts.map(product => product.name).join(', ') : 'nenhum produto vinculado'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(collection)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-void-lighter text-text-muted hover:text-neon-pink transition-colors text-sm">
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button onClick={() => handleDelete(collection.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-void-lighter text-text-muted hover:text-red-400 transition-colors text-sm">
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {storeCollections.length === 0 && (
        <div className="review-card rounded-xl p-8 text-center text-text-dim">
          Nenhuma colecao cadastrada ainda.
        </div>
      )}

      {(creating || editing) && (
        <CollectionModal
          collection={editing}
          products={products}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSave={async collection => {
            const result = editing
              ? await updateStoreCollection(editing.id, collection)
              : await addStoreCollection(collection)
            setFeedback(result.success
              ? { type: 'success', message: 'Colecao salva com sucesso.' }
              : { type: 'error', message: result.error || 'Nao foi possivel salvar a colecao.' })
            if (result.success) {
              setCreating(false)
              setEditing(null)
            }
          }}
        />
      )}
    </div>
  )
}

function CollectionModal({
  collection,
  products,
  onClose,
  onSave,
}: {
  collection: StoreCollection | null
  products: { id: number; name: string }[]
  onClose: () => void
  onSave: (collection: Omit<StoreCollection, 'id' | 'createdAt'>) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<StoreCollection, 'id' | 'createdAt'>>(
    collection ? {
      name: collection.name,
      subtitle: collection.subtitle,
      image: collection.image,
      color: collection.color,
      price: collection.price,
      discountPercent: collection.discountPercent,
      active: collection.active,
      productIds: collection.productIds,
    } : emptyCollection
  )
  const [saving, setSaving] = useState(false)

  const toggleProduct = (id: number) => {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter(productId => productId !== id)
        : [...prev.productIds, id],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto review-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text-main">{collection ? 'Editar Colecao' : 'Nova Colecao'}</h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink"><X className="w-5 h-5" /></button>
        </div>

        <form
          className="space-y-4"
          onSubmit={async event => {
            event.preventDefault()
            setSaving(true)
            await onSave({
              ...form,
              discountPercent: Math.min(100, Math.max(0, form.discountPercent)),
            })
            setSaving(false)
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Nome</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Cor da colecao</label>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                className="w-full h-10 bg-void-light border border-neon-pink/20 rounded-lg px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Valor</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Desconto (%)</label>
              <input type="number" min="0" max="100" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Imagem</label>
              <input required value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                placeholder="URL da imagem da colecao"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Descricao curta</label>
              <textarea value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                rows={3}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50 resize-none" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-neon-pink" />
              <span className="text-sm text-text-muted">Colecao ativa no site</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Produtos da colecao</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {products.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={`text-left rounded-lg border px-3 py-2 text-sm transition-colors ${form.productIds.includes(product.id) ? 'border-neon-pink bg-neon-pink/10 text-neon-pink' : 'border-neon-pink/10 bg-void-light text-text-muted hover:text-text-main'}`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-text-muted hover:text-text-main transition-colors">Cancelar</button>
            <button type="submit" disabled={saving}
              className="bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white px-6 py-2 rounded-lg font-heading font-bold text-sm flex items-center gap-2 transition-all">
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
