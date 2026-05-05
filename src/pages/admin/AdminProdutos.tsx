import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Upload,
} from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'
import type { Product } from '../../data/storeData'

export default function AdminProdutos() {
  const { products, addProduct, updateProduct, deleteProduct, uploadImage, refreshProducts } = useAdmin()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  const ITEMS_PER_PAGE = 10

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSave = async (product: Product) => {
    setIsSaving(true)
    if (isCreating) {
      await addProduct(product)
      setIsCreating(false)
    } else if (editing) {
      await updateProduct(product.id, product)
      setEditing(null)
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Produtos</h1>
          <p className="text-text-dim text-sm">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-neon-pink hover:bg-hot-pink text-white px-4 py-2 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </button>
      </div>

      <div className="review-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Produto</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Preco</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.length === 0 && !isCreating && (
                <tr><td colSpan={5} className="py-8 text-center text-text-dim">Nenhum produto cadastrado. Clique em "Novo produto" para adicionar.</td></tr>
              )}
              {paginated.map(product => (
                <tr key={product.id} className="border-t border-neon-pink/5 hover:bg-void-lighter/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-void-lighter overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                      <span className="text-text-main font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-text-dim capitalize">{product.category}</td>
                  <td className="py-3 text-neon-pink font-semibold">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                  <td className="py-3">
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">{product.isNew ? 'Novo' : 'Ativo'}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditing(product)} className="p-1.5 text-text-dim hover:text-neon-pink transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <Link to={`/produto/${product.id}`} className="p-1.5 text-text-dim hover:text-blue-400 transition-colors"><Eye className="w-3.5 h-3.5" /></Link>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-text-dim hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg bg-void-lighter border border-neon-pink/10 text-text-muted hover:text-neon-pink disabled:opacity-30 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce((acc: (number | string)[], p, i, arr) => {
              if (i > 0 && (arr[i - 1] as number) < p - 1) acc.push('...')
              acc.push(p)
              return acc
            }, []).map((p, i) => typeof p === 'string' ? (
              <span key={i} className="text-text-dim px-1">{p}</span>
            ) : (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center ${currentPage === p ? 'bg-neon-pink text-white' : 'bg-void-lighter border border-neon-pink/10 text-text-muted hover:text-neon-pink'}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg bg-void-lighter border border-neon-pink/10 text-text-muted hover:text-neon-pink disabled:opacity-30 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      {(editing || isCreating) && (
        <ProductModal
          product={editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setIsCreating(false) }}
          uploadImage={uploadImage}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

function ProductModal({
  product,
  onSave,
  onClose,
  uploadImage,
  isSaving,
}: {
  product: Product | null
  onSave: (p: Product) => void
  onClose: () => void
  uploadImage: (file: File, path: string) => Promise<string | null>
  isSaving: boolean
}) {
  const [form, setForm] = useState<Partial<Product>>(
    product || {
      name: '',
      price: 0,
      image: '',
      images: [],
      category: 'cabelos',
      isNew: true,
      isBestseller: false,
      description: '',
      inGameImages: [],
      specs: [],
    }
  )
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'images' | 'inGameImages') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const url = await uploadImage(file, 'products')
    setUploading(false)

    if (url) {
      if (field === 'image') {
        setForm(prev => ({ ...prev, image: url }))
      } else {
        setForm(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), url],
        }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(form as Product),
      id: product?.id || Date.now(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto review-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text-main">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Nome</label>
              <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" required />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Preco</label>
              <input type="number" step="0.01" value={form.price || 0} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" required />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Categoria</label>
              <select value={form.category || 'cabelos'} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50">
                <option value="cabelos">Cabelos</option>
                <option value="roupas">Roupas</option>
                <option value="acessorios">Acessorios</option>
                <option value="conjuntos">Conjuntos</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Imagem principal</label>
              <div className="flex gap-3 items-start">
                {form.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-void-lighter flex-shrink-0">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="text" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="URL da imagem ou faca upload"
                    className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 text-sm mb-2" />
                  <label className="flex items-center gap-2 cursor-pointer bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-4 py-2 text-sm text-neon-pink transition-colors w-fit">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Enviando...' : 'Enviar imagem'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'image')} />
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Descricao</label>
              <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50 resize-none" />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNew || false} onChange={e => setForm({ ...form, isNew: e.target.checked })} className="accent-neon-pink" />
                <span className="text-sm text-text-muted">Novo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isBestseller || false} onChange={e => setForm({ ...form, isBestseller: e.target.checked })} className="accent-neon-pink" />
                <span className="text-sm text-text-muted">Mais vendido</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-text-muted hover:text-text-main transition-colors">Cancelar</button>
            <button type="submit" disabled={isSaving || uploading}
              className="bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white px-6 py-2 rounded-lg font-heading font-bold text-sm flex items-center gap-2 transition-all">
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
