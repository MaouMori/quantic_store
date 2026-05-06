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
import type { AdminActionResult } from '../../context/AdminContext'
import { categories as defaultCategories, styles as defaultStyles, colors as defaultColors, type Product } from '../../data/storeData'
import { AdminFeedback } from '../../components/admin/AdminFeedback'

export default function AdminProdutos() {
  const {
    products,
    storeCollections,
    productCategories,
    productStyles,
    productColors,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    refreshProducts,
  } = useAdmin()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
    setFeedback(null)
    let result: AdminActionResult = { success: false, error: 'Nenhuma operacao executada.' }
    if (isCreating) {
      result = await addProduct(product)
    } else if (editing) {
      result = await updateProduct(product.id, product)
    }
    if (result.success) {
      setFeedback({ type: 'success', message: 'Produto salvo com sucesso.' })
      setIsCreating(false)
      setEditing(null)
    } else {
      setFeedback({ type: 'error', message: result.error || 'Nao foi possivel salvar o produto.' })
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const result = await deleteProduct(id)
      setFeedback(result.success
        ? { type: 'success', message: 'Produto excluido com sucesso.' }
        : { type: 'error', message: result.error || 'Nao foi possivel excluir o produto.' })
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

      {feedback && <AdminFeedback type={feedback.type} message={feedback.message} />}

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
                      <Link to={`/produto/${product.id}?from=admin`} className="p-1.5 text-text-dim hover:text-blue-400 transition-colors"><Eye className="w-3.5 h-3.5" /></Link>
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
          collections={storeCollections}
          categories={productCategories}
          styles={productStyles}
          colors={productColors}
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
  collections,
  categories,
  styles,
  colors,
}: {
  product: Product | null
  onSave: (p: Product) => void
  onClose: () => void
  uploadImage: (file: File, path: string) => Promise<string | null>
  isSaving: boolean
  collections: { id: number; name: string; active: boolean }[]
  categories: { name: string; slug: string; active: boolean }[]
  styles: { name: string; slug: string; active: boolean }[]
  colors: { name: string; slug: string; hex: string; active: boolean }[]
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
      discountPercent: 0,
      rating: 0,
      ratingCount: 0,
      collectionId: null,
      sellIndividually: true,
      description: '',
      inGameImages: [],
      specs: [],
    }
  )
  const [uploading, setUploading] = useState(false)
  const [newSpec, setNewSpec] = useState({ label: '', value: '' })

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
      images: form.images || [],
      inGameImages: form.inGameImages || [],
      specs: form.specs || [],
      discountPercent: Math.min(100, Math.max(0, form.discountPercent || 0)),
      id: product?.id || Date.now(),
    })
  }

  const removeImage = (field: 'images' | 'inGameImages', index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }))
  }

  const addImageUrl = (field: 'images' | 'inGameImages') => {
    const url = window.prompt('Cole a URL da imagem')
    if (!url?.trim()) return
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), url.trim()],
    }))
  }

  const addSpec = () => {
    if (!newSpec.label.trim() || !newSpec.value.trim()) return
    setForm(prev => ({
      ...prev,
      specs: [...(prev.specs || []), { label: newSpec.label.trim(), value: newSpec.value.trim() }],
    }))
    setNewSpec({ label: '', value: '' })
  }

  const removeSpec = (index: number) => {
    setForm(prev => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index),
    }))
  }

  const toggleArrayValue = (field: 'style' | 'color', value: string) => {
    setForm(prev => {
      const current = prev[field] || []
      if (field === 'color') {
        return {
          ...prev,
          color: current.includes(value) ? [] : [value],
        }
      }

      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter(item => item !== value)
          : [...current, value],
      }
    })
  }

  const activeCategories = categories.length > 0
    ? categories.filter(category => category.active)
    : defaultCategories.filter(category => category.value !== 'todos').map(category => ({
      name: category.label,
      slug: category.value,
      active: true,
    }))
  const activeStyles = styles.length > 0
    ? styles.filter(style => style.active)
    : defaultStyles.map(style => ({ name: style.label, slug: style.value, active: true }))
  const activeColors = colors.length > 0
    ? colors.filter(color => color.active)
    : defaultColors.map(color => ({ name: color.value, slug: color.value, hex: color.hex, active: true }))
  const activeCollections = collections.filter(collection => collection.active)

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
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Desconto (%)</label>
              <input type="number" min="0" max="100" step="1" value={form.discountPercent || 0} onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Categoria</label>
              <select value={form.category || 'cabelos'} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50">
                {(activeCategories.length > 0 ? activeCategories : [
                  { slug: 'cabelos', name: 'Cabelos' },
                  { slug: 'roupas', name: 'Roupas' },
                  { slug: 'acessorios', name: 'Acessorios' },
                  { slug: 'conjuntos', name: 'Conjuntos' },
                  { slug: 'outros', name: 'Outros' },
                ]).map(category => (
                  <option key={category.slug} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Colecao</label>
              <select value={form.collectionId || ''} onChange={e => setForm({ ...form, collectionId: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50">
                <option value="">Sem colecao</option>
                {activeCollections.map(collection => (
                  <option key={collection.id} value={collection.id}>{collection.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.sellIndividually ?? true} onChange={e => setForm({ ...form, sellIndividually: e.target.checked })} className="accent-neon-pink" />
                <span className="text-sm text-text-muted">Vender produto separado</span>
              </label>
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
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Galeria do produto</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(form.images || []).map((img, index) => (
                  <div key={`${img}-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden bg-void-lighter border border-neon-pink/10">
                    <img src={img} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage('images', index)} className="absolute top-1 right-1 w-5 h-5 rounded bg-void/80 text-text-main flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-4 py-2 text-sm text-neon-pink transition-colors w-fit">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Enviando...' : 'Enviar para galeria'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'images')} />
                </label>
                <button type="button" onClick={() => addImageUrl('images')} className="bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-4 py-2 text-sm text-neon-pink transition-colors">
                  Adicionar URL
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Imagens do cabelo no jogo</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(form.inGameImages || []).map((img, index) => (
                  <div key={`${img}-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden bg-void-lighter border border-neon-purple/20">
                    <img src={img} alt={`No jogo ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage('inGameImages', index)} className="absolute top-1 right-1 w-5 h-5 rounded bg-void/80 text-text-main flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-4 py-2 text-sm text-neon-pink transition-colors w-fit">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Enviando...' : 'Enviar imagem no jogo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'inGameImages')} />
                </label>
                <button type="button" onClick={() => addImageUrl('inGameImages')} className="bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-4 py-2 text-sm text-neon-pink transition-colors">
                  Adicionar URL
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Descricao</label>
              <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50 resize-none" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Estilos</label>
              <div className="flex flex-wrap gap-2">
                {activeStyles.map(style => (
                  <button
                    key={style.slug}
                    type="button"
                    onClick={() => toggleArrayValue('style', style.slug)}
                    className={`rounded-lg border px-3 py-2 text-xs font-heading font-bold transition-colors ${(form.style || []).includes(style.slug) ? 'border-neon-pink bg-neon-pink/10 text-neon-pink' : 'border-neon-pink/10 bg-void-light text-text-muted hover:text-text-main'}`}
                  >
                    {style.name}
                  </button>
                ))}
                {activeStyles.length === 0 && <p className="text-text-dim text-sm">Crie estilos em Categorias antes de marcar aqui.</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Cor do cabelo</label>
              <div className="flex flex-wrap gap-2">
                {activeColors.map(color => (
                  <button
                    key={color.slug}
                    type="button"
                    onClick={() => toggleArrayValue('color', color.slug)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${(form.color || []).includes(color.slug) ? 'border-neon-pink bg-neon-pink/10 text-neon-pink' : 'border-neon-pink/10 bg-void-light text-text-muted hover:text-text-main'}`}
                  >
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
                {activeColors.length === 0 && <p className="text-text-dim text-sm">Crie cores em Categorias antes de marcar aqui.</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Especificacoes</label>
              <div className="space-y-2 mb-3">
                {(form.specs || []).map((spec, index) => (
                  <div key={`${spec.label}-${index}`} className="flex items-center gap-2 bg-void-light border border-neon-pink/10 rounded-lg px-3 py-2">
                    <span className="text-text-main text-sm font-semibold">{spec.label}:</span>
                    <span className="text-text-muted text-sm flex-1">{spec.value}</span>
                    <button type="button" onClick={() => removeSpec(index)} className="text-text-dim hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <input type="text" value={newSpec.label} onChange={e => setNewSpec(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Nome. Ex: Formato"
                  className="bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 text-sm" />
                <input type="text" value={newSpec.value} onChange={e => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Valor. Ex: .ydd / .ytd"
                  className="bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 text-sm" />
                <button type="button" onClick={addSpec} className="bg-void-lighter hover:bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-4 py-2 text-sm text-neon-pink transition-colors">
                  Adicionar
                </button>
              </div>
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
