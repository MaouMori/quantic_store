import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import type { Banner } from '../../context/AdminContext'

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner } = useAdmin()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Banner | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const filtered = banners.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (banner: Banner) => {
    if (isCreating) {
      addBanner({
        title: banner.title,
        image: banner.image,
        link: banner.link,
        position: banner.position,
        active: banner.active,
      })
      setIsCreating(false)
    } else if (editing) {
      updateBanner(banner.id, banner)
      setEditing(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      deleteBanner(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Banners</h1>
          <p className="text-text-dim text-sm">Gerencie banners do site</p>
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
          {filtered.map(banner => (
            <div
              key={banner.id}
              className="review-card rounded-xl overflow-hidden"
            >
              <div className="aspect-video bg-void-lighter overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center">
                        <Image class="w-8 h-8 text-text-dim mb-2" />
                        <span class="text-text-dim text-xs">${banner.image}</span>
                      </div>
                    `
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-main">{banner.title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      banner.active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-text-dim text-xs mb-1">Posicao: {banner.position}</p>
                <p className="text-text-dim text-xs mb-3">Link: {banner.link}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(banner)}
                    className="p-1.5 text-text-dim hover:text-neon-pink transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 text-text-dim hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
          onClose={() => {
            setEditing(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

function BannerModal({
  banner,
  onSave,
  onClose,
}: {
  banner: Banner | null
  onSave: (b: Banner) => void
  onClose: () => void
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
          <h2 className="font-heading font-bold text-lg text-text-main">
            {banner ? 'Editar Banner' : 'Novo Banner'}
          </h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Titulo</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Imagem</label>
            <input
              type="text"
              value={form.image || ''}
              onChange={e => setForm({ ...form, image: e.target.value })}
              placeholder="/banners/nome.jpg"
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Link</label>
            <input
              type="text"
              value={form.link || ''}
              onChange={e => setForm({ ...form, link: e.target.value })}
              placeholder="/loja"
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Posicao</label>
            <select
              value={form.position || 'home'}
              onChange={e => setForm({ ...form, position: e.target.value as Banner['position'] })}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
            >
              <option value="home">Home</option>
              <option value="loja">Loja</option>
              <option value="colecoes">Colecoes</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active || false}
              onChange={e => setForm({ ...form, active: e.target.checked })}
              className="accent-neon-pink"
            />
            <span className="text-sm text-text-muted">Banner ativo</span>
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
