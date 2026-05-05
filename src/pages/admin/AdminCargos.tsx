import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'
import type { Role } from '../../context/AdminContext'

export default function AdminCargos() {
  const { roles, addRole, updateRole, deleteRole } = useAdmin()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Role | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (role: Role) => {
    if (isCreating) {
      addRole({
        name: role.name,
        color: role.color,
        permissions: role.permissions,
      })
      setIsCreating(false)
    } else if (editing) {
      updateRole(role.id, role)
      setEditing(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cargo?')) {
      deleteRole(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-text-main">Cargos</h1>
          <p className="text-text-dim text-sm">Gerencie cargos e permissoes</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-neon-pink hover:bg-hot-pink text-white px-4 py-2 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo cargo
        </button>
      </div>

      <div className="review-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="Buscar cargos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map(role => (
            <div
              key={role.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-void-lighter/30"
            >
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: role.color + '20', color: role.color }}
              >
                {role.color}
              </span>
              <span className="text-text-main font-semibold w-32">{role.name}</span>
              <span className="text-text-dim text-sm flex-1">
                {role.permissions.join(', ')}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(role)}
                  className="p-1.5 text-text-dim hover:text-neon-pink transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="p-1.5 text-text-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(editing || isCreating) && (
        <RoleModal
          role={editing}
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

function RoleModal({
  role,
  onSave,
  onClose,
}: {
  role: Role | null
  onSave: (r: Role) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Partial<Role>>(
    role || {
      name: '',
      color: '#ff2d95',
      permissions: [],
    }
  )

  const availablePermissions = [
    'all',
    'products',
    'orders',
    'users',
    'content',
    'banners',
    'pages',
    'media',
    'panel_limited',
  ]

  const togglePermission = (perm: string) => {
    const current = form.permissions || []
    if (current.includes(perm)) {
      setForm({ ...form, permissions: current.filter(p => p !== perm) })
    } else {
      setForm({ ...form, permissions: [...current, perm] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(form as Role),
      id: role?.id || Date.now().toString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg review-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text-main">
            {role ? 'Editar Cargo' : 'Novo Cargo'}
          </h2>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-neon-pink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Nome</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Cor</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color || '#ff2d95'}
                onChange={e => setForm({ ...form, color: e.target.value })}
                className="w-12 h-10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={form.color || ''}
                onChange={e => setForm({ ...form, color: e.target.value })}
                className="flex-1 bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-neon-pink/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Permissoes</label>
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map(perm => (
                <label
                  key={perm}
                  className="flex items-center gap-2 p-2 rounded-lg bg-void-lighter/30 cursor-pointer hover:bg-void-lighter transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(form.permissions || []).includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="accent-neon-pink"
                  />
                  <span className="text-sm text-text-muted capitalize">{perm.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

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
