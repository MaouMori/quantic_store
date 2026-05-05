import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import type { Banner } from '../../context/AdminContext'

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner, uploadImage, refreshBanners } = useAdmin()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Banner | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    refreshBanners()
  }, [refreshBanners])

  const filtered = banners.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (banner: Banner) => {
    setIsSaving(true)
    if (isCreating) {
      await addBanner({
        title: banner.title,
        image: banner.image,
        link: banner.link,
        position: banner.position,
        active: banner.active,
      })
      setIsCreating(false)
    } else if (editing) {
      await updateBanner(banner.id, banner)
      setEditing(null)
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      await deleteBanner(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Banners</h1>
          <p className="text-text-dim text-sm">{banners.length} banners cadastrados</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-neon-pink hover:bg-hot-pink text-white px-4 py-2 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo banner
        </button>
      </div>

      <div className="review-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="Buscar banners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.length === 0 && !isCreating && (
            <p className="text-text-dim text-sm text-center py-8 col-span-full">Nenhum banner cadastrado.</p>
          )}
          {filtered.map(banner => (
            <div key={banner.id} className="review-card rounded-xl overflow-hidden">
              <div className="aspect-video bg-void-lighter overflow-hidden">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-main">{banner.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${banner.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{banner.active ? 'Ativo' : 'Inativo'}</span>
                </div>
                <p className="text-text-dim text-xs mb-1">Posicao: {banner.position}</p>
                <p className="text-text-dim text-xs mb-3">Link: {banner.link}</p>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(banner)} className="p-1.5 text-text-dim hover:text-neon-pink transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(banner.id)} className="p-1.5 text-text-dim hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(editing || isCreating) && (
        <BannerModal
          banner={editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setIsCreating(false) }}
          uploadImage={uploadImage}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

function BannerModal({
  banner,
  onSave,
  onClose,
  uploadImage,
  isSaving,
}: {
  banner: Banner | null
  onSave: (b: Banner) => void
  onClose: () => void
  uploadImage: (file: File, path: string) => Promise<string | null>
  isSaving: boolean
}) {
  const [form, setForm] = useState<Partial<Banner>>(
    banner || {
      title: '',
      image: '',
      link: '',
      position: 'home',
      active: true,
    }
  )
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file, 'banners')
    setUploading(false)
    if (url) setForm(prev => ({ ...prev, image: url }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(form as Banner),
      id: banner?.id || Date.now().toString(),
      createdAt: banner?.createdAt || new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg review-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text-main">{banner ? 'Editar Banner' : 'Novo Banner'}</h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Titulo</label>
            <input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50" required />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Imagem</label>
            <div className="flex gap-3 items-start">
              {form.image && (
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-void-lighter flex-shrink-0">
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
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Link</label>
            <input type="text" value={form.link || ''} onChange={e => setForm({ ...form, link: e.target.value })}
              placeholder="/loja" className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50" />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Posicao</label>
            <select value={form.position || 'home'} onChange={e => setForm({ ...form, position: e.target.value as Banner['position'] })}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50">
              <option value="home">Home</option>
              <option value="loja">Loja</option>
              <option value="colecoes">Colecoes</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active || false} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-neon-pink" />
            <span className="text-sm text-text-muted">Banner ativo</span>
          </label>

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
