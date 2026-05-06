import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CreditCard, History, ClipboardList, Settings, MessageSquare, FileText, FolderTree, Tag, Lock, UserCog, Plus, Trash2, Save, Star, Search } from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'
import { AdminFeedback } from '../../components/admin/AdminFeedback'
import { supabase } from '../../lib/supabase'

export default function AdminClientes() {
  const { customers } = useAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Clientes</h1>
        <p className="text-text-dim text-sm">{customers.length} clientes cadastrados</p>
      </div>
      <div className="review-card rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Discord</th>
                <th className="pb-3">Pedidos</th>
                <th className="pb-3">Gasto total</th>
                <th className="pb-3">Desde</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map(c => (
                <tr key={c.id} className="border-t border-neon-pink/5 hover:bg-void-lighter/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-void-lighter overflow-hidden">
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span>👤</span>' }}
                        />
                      </div>
                      <div>
                        <p className="text-text-main font-medium">{c.name}</p>
                        <p className="text-text-dim text-xs">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-text-dim">{c.discord}</td>
                  <td className="py-3 text-text-main">{c.totalOrders}</td>
                  <td className="py-3 text-neon-pink font-semibold">R$ {c.totalSpent.toFixed(2).replace('.', ',')}</td>
                  <td className="py-3 text-text-dim">{c.joinedAt}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'ativo' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {c.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function AdminCategorias() {
  const {
    productCategories,
    productStyles,
    productColors,
    addProductCategory,
    deleteProductCategory,
    addProductStyle,
    deleteProductStyle,
    addProductColor,
    deleteProductColor,
  } = useAdmin()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const handleAdd = async (type: 'category' | 'style' | 'color', name: string, hex?: string) => {
    const slug = slugify(name)
    if (!name.trim() || !slug) return
    const result =
      type === 'category'
        ? await addProductCategory({ name: name.trim(), slug, active: true })
        : type === 'style'
          ? await addProductStyle({ name: name.trim(), slug, active: true })
          : await addProductColor({ name: name.trim(), slug, hex: hex || '#ff2d95', active: true })
    setFeedback(result.success
      ? { type: 'success', message: 'Item salvo com sucesso.' }
      : { type: 'error', message: result.error || 'Nao foi possivel salvar.' })
  }

  const handleDelete = async (type: 'category' | 'style' | 'color', id: string) => {
    const result =
      type === 'category'
        ? await deleteProductCategory(id)
        : type === 'style'
          ? await deleteProductStyle(id)
          : await deleteProductColor(id)
    setFeedback(result.success
      ? { type: 'success', message: 'Item excluido com sucesso.' }
      : { type: 'error', message: result.error || 'Nao foi possivel excluir.' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Categorias</h1>
        <p className="text-text-dim text-sm">Gerencie categorias, estilos e cores usadas nos produtos</p>
      </div>
      {feedback && <AdminFeedback type={feedback.type} message={feedback.message} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TaxonomyPanel
          title="Categorias"
          icon={<FolderTree className="w-5 h-5 text-neon-pink" />}
          items={productCategories}
          onAdd={name => handleAdd('category', name)}
          onDelete={id => handleDelete('category', id)}
        />
        <TaxonomyPanel
          title="Estilos"
          icon={<Tag className="w-5 h-5 text-neon-pink" />}
          items={productStyles}
          onAdd={name => handleAdd('style', name)}
          onDelete={id => handleDelete('style', id)}
        />
        <TaxonomyPanel
          title="Cores"
          icon={<Tag className="w-5 h-5 text-neon-pink" />}
          items={productColors}
          withColor
          onAdd={(name, hex) => handleAdd('color', name, hex)}
          onDelete={id => handleDelete('color', id)}
        />
      </div>
    </div>
  )
}

export function AdminTags() {
  return <AdminCategorias />
}

function TaxonomyPanel({
  title,
  icon,
  items,
  withColor = false,
  onAdd,
  onDelete,
}: {
  title: string
  icon: ReactNode
  items: { id: string; name: string; slug: string; active: boolean; hex?: string }[]
  withColor?: boolean
  onAdd: (name: string, hex?: string) => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState('')
  const [hex, setHex] = useState('#ff2d95')

  return (
    <div className="review-card rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-heading font-bold text-text-main">{title}</h2>
      </div>
      <div className="flex gap-2">
        {withColor && (
          <input type="color" value={hex} onChange={event => setHex(event.target.value)}
            className="w-11 h-10 bg-void-light border border-neon-pink/20 rounded-lg px-1 py-1" />
        )}
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder={`Nova ${title.toLowerCase()}`}
          className="min-w-0 flex-1 bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 text-sm"
        />
        <button
          onClick={() => {
            onAdd(name, hex)
            setName('')
          }}
          className="w-10 h-10 rounded-lg bg-neon-pink text-white flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 rounded-lg bg-void-light border border-neon-pink/10 px-3 py-2">
            {item.hex && <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: item.hex }} />}
            <div className="flex-1 min-w-0">
              <p className="text-text-main text-sm truncate">{item.name}</p>
              <p className="text-text-dim text-[10px] truncate">{item.slug}</p>
            </div>
            <button onClick={() => onDelete(item.id)} className="text-text-dim hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-text-dim text-sm">Nenhum item cadastrado.</p>}
      </div>
    </div>
  )
}

export function AdminUsuarios() {
  const [profiles, setProfiles] = useState<{ id: string; name: string; email: string; role: string; role_color: string }[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Cliente' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadProfiles = useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select('id,name,email,role,role_color').order('created_at', { ascending: false })
    if (!error && data) setProfiles(data as typeof profiles)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProfiles()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadProfiles])

  const createUser = async () => {
    setSaving(true)
    setFeedback(null)
    try {
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Nao foi possivel criar usuario.')
      setFeedback({ type: 'success', message: 'Usuario criado com sucesso.' })
      setForm({ name: '', email: '', password: '', role: 'Cliente' })
      await loadProfiles()
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Nao foi possivel criar usuario.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Usuarios</h1>
        <p className="text-text-dim text-sm">Veja perfis existentes e crie usuarios diretamente pelo painel</p>
      </div>
      {feedback && <AdminFeedback type={feedback.type} message={feedback.message} />}
      <div className="review-card rounded-xl p-5">
        <h2 className="font-heading font-bold text-text-main mb-4 flex items-center gap-2">
          <UserCog className="w-5 h-5 text-neon-pink" />
          Novo usuario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
            placeholder="Nome" className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main" />
          <input value={form.email} onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
            placeholder="Email" className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main" />
          <input type="password" value={form.password} onChange={event => setForm(prev => ({ ...prev, password: event.target.value }))}
            placeholder="Senha" className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main" />
          <div className="flex gap-2">
            <select value={form.role} onChange={event => setForm(prev => ({ ...prev, role: event.target.value }))}
              className="min-w-0 flex-1 bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main">
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
            <button onClick={createUser} disabled={saving} className="w-10 rounded-lg bg-neon-pink text-white disabled:opacity-50 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-text-dim text-xs mt-3">Requer Vercel env SUPABASE_SERVICE_ROLE_KEY. Sem ela, o Supabase nao permite criar usuarios pelo frontend com seguranca.</p>
      </div>

      <div className="review-card rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Nome</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Cargo</th>
                <th className="pb-3">ID</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {profiles.map(profile => (
                <tr key={profile.id} className="border-t border-neon-pink/5">
                  <td className="py-3 text-text-main">{profile.name}</td>
                  <td className="py-3 text-text-dim">{profile.email}</td>
                  <td className="py-3"><span className="rounded-full bg-neon-pink/10 text-neon-pink text-xs px-2 py-1">{profile.role}</span></td>
                  <td className="py-3 text-text-dim font-mono text-xs">{profile.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {profiles.length === 0 && <p className="text-text-dim text-center py-8">Nenhum perfil encontrado.</p>}
        </div>
      </div>
    </div>
  )
}

export function AdminPermissoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Permissoes</h1>
        <p className="text-text-dim text-sm">Configure permissoes detalhadas</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Lock className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracao de permissoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminPaginas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Paginas</h1>
        <p className="text-text-dim text-sm">Gerencie paginas do site</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <FileText className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de paginas em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminDepoimentos() {
  const { feedbacks, updateFeedback, deleteFeedback } = useAdmin()
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState({ name: '', text: '', rating: 5, approved: true })
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const startEdit = (item: typeof feedbacks[number]) => {
    setEditing(item.id)
    setDraft({ name: item.name, text: item.text, rating: item.rating, approved: item.approved })
  }

  const save = async (id: string) => {
    const result = await updateFeedback(id, draft)
    setFeedback(result.success
      ? { type: 'success', message: 'Feedback atualizado.' }
      : { type: 'error', message: result.error || 'Nao foi possivel atualizar.' })
    if (result.success) setEditing(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Apagar este feedback?')) return
    const result = await deleteFeedback(id)
    setFeedback(result.success
      ? { type: 'success', message: 'Feedback apagado.' }
      : { type: 'error', message: result.error || 'Nao foi possivel apagar.' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Depoimentos</h1>
        <p className="text-text-dim text-sm">Veja, aprove, edite ou apague feedbacks que aparecem na home</p>
      </div>
      {feedback && <AdminFeedback type={feedback.type} message={feedback.message} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {feedbacks.map(item => (
          <div key={item.id} className="review-card rounded-xl p-5 space-y-3">
            {editing === item.id ? (
              <>
                <input value={draft.name} onChange={event => setDraft(prev => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main" />
                <textarea value={draft.text} onChange={event => setDraft(prev => ({ ...prev, text: event.target.value }))}
                  className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main resize-none" rows={4} />
                <div className="flex items-center gap-3">
                  <input type="number" min="1" max="5" value={draft.rating} onChange={event => setDraft(prev => ({ ...prev, rating: Number(event.target.value) }))}
                    className="w-20 bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main" />
                  <label className="flex items-center gap-2 text-text-muted text-sm">
                    <input type="checkbox" checked={draft.approved} onChange={event => setDraft(prev => ({ ...prev, approved: event.target.checked }))} className="accent-neon-pink" />
                    Aparece na home
                  </label>
                </div>
                <button onClick={() => save(item.id)} className="bg-neon-pink text-white rounded-lg px-4 py-2 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Salvar
                </button>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading font-bold text-text-main">{item.name}</h3>
                    <p className="text-text-dim text-xs">{item.email || item.discord || 'Sem contato'}</p>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-1 ${item.approved ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {item.approved ? 'Publicado' : 'Oculto'}
                  </span>
                </div>
                <div className="flex gap-0.5">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="w-4 h-4 text-star fill-star" />)}</div>
                <p className="text-text-muted text-sm">{item.text}</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="text-neon-pink text-sm">Editar</button>
                  <button onClick={() => remove(item.id)} className="text-red-400 text-sm">Apagar</button>
                </div>
              </>
            )}
          </div>
        ))}
        {feedbacks.length === 0 && (
          <div className="review-card rounded-xl p-5 text-center py-16 lg:col-span-2">
            <MessageSquare className="w-12 h-12 text-text-dim mx-auto mb-4" />
            <p className="text-text-muted">Nenhum feedback enviado ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminConfiguracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Configuracoes do Site</h1>
        <p className="text-text-dim text-sm">Configure informacoes gerais</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Settings className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminTransacoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Transacoes</h1>
        <p className="text-text-dim text-sm">Historico de transacoes</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <CreditCard className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Historico de transacoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminHistorico() {
  const { orders } = useAdmin()
  const [search, setSearch] = useState('')
  const rows = orders.flatMap(order => order.items.map(item => ({
    order,
    item,
    lineTotal: item.price * item.quantity,
  }))).filter(row => {
    const query = search.toLowerCase()
    return !query || row.order.customer.toLowerCase().includes(query) || row.item.name.toLowerCase().includes(query) || row.order.id.toLowerCase().includes(query)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Historico de Compras</h1>
        <p className="text-text-dim text-sm">Relatorio completo de compras</p>
      </div>
      <div className="review-card rounded-xl p-5">
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar compra..."
            className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Pedido</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Produto</th>
                <th className="pb-3">Qtd</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map(row => (
                <tr key={`${row.order.id}-${row.item.productId}-${row.item.name}`} className="border-t border-neon-pink/5">
                  <td className="py-3 text-text-dim font-mono text-xs">{row.order.id}</td>
                  <td className="py-3 text-text-main">{row.order.customer}</td>
                  <td className="py-3 text-text-main">{row.item.name}</td>
                  <td className="py-3 text-text-dim">{row.item.quantity}</td>
                  <td className="py-3 text-neon-pink font-semibold">R$ {row.lineTotal.toFixed(2).replace('.', ',')}</td>
                  <td className="py-3 text-text-dim">{row.order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="text-center py-16">
              <History className="w-12 h-12 text-text-dim mx-auto mb-4" />
              <p className="text-text-muted">Nenhuma compra encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AdminValores() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Valores e Taxas</h1>
        <p className="text-text-dim text-sm">Configure precos e taxas</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <ClipboardList className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracao de valores em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminLoja() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Configuracoes da Loja</h1>
        <p className="text-text-dim text-sm">Configure opcoes da loja</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Settings className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracoes da loja em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminIntegracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Integracoes</h1>
        <p className="text-text-dim text-sm">Configure integracoes externas</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <CreditCard className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Integracoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminLogs() {
  const [running, setRunning] = useState<string | null>(null)
  const [results, setResults] = useState<{ name: string; success: boolean; message: string }[]>([])

  const pushResult = (name: string, success: boolean, message: string) => {
    setResults(prev => [{ name, success, message }, ...prev].slice(0, 12))
  }

  const runTest = async (name: string, test: () => Promise<void>) => {
    setRunning(name)
    try {
      await test()
      pushResult(name, true, 'Teste concluido com sucesso.')
    } catch (err) {
      pushResult(name, false, err instanceof Error ? err.message : 'Teste falhou.')
    } finally {
      setRunning(null)
    }
  }

  const assertDb = (error: { message: string } | null) => {
    if (error) throw new Error(error.message)
  }

  const testProduct = () => runTest('Produtos', async () => {
    const marker = Date.now()
    const { data, error } = await supabase.from('products').insert({
      name: `TESTE PRODUTO ${marker}`,
      price: 1,
      image: '/hero/slide1.jpg',
      images: ['/hero/slide1.jpg'],
      category: 'outros',
      is_new: true,
      is_bestseller: false,
      description: 'Produto criado pelo teste automatico do painel.',
      in_game_images: [],
      specs: [],
    }).select('id').single()
    assertDb(error)
    if (!data) throw new Error('Produto teste nao retornou id.')

    const update = await supabase.from('products').update({ name: `TESTE PRODUTO OK ${marker}` }).eq('id', data.id)
    assertDb(update.error)

    const remove = await supabase.from('products').delete().eq('id', data.id)
    assertDb(remove.error)
  })

  const testBanner = () => runTest('Banners', async () => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from('banners').insert({
      id,
      title: `TESTE BANNER ${Date.now()}`,
      image: '/hero/slide1.jpg',
      link: '/loja',
      position: 'loja',
      active: true,
    })
    assertDb(error)

    const update = await supabase.from('banners').update({ active: false }).eq('id', id)
    assertDb(update.error)

    const remove = await supabase.from('banners').delete().eq('id', id)
    assertDb(remove.error)
  })

  const testCoupon = () => runTest('Cupons', async () => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from('coupons').insert({
      id,
      code: `TESTE${Date.now().toString().slice(-6)}`,
      discount: 1,
      type: 'percent',
      min_purchase: 0,
      max_uses: 1,
      active: true,
    })
    assertDb(error)

    const update = await supabase.from('coupons').update({ active: false }).eq('id', id)
    assertDb(update.error)

    const remove = await supabase.from('coupons').delete().eq('id', id)
    assertDb(remove.error)
  })

  const testRole = () => runTest('Cargos', async () => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from('roles').insert({
      id,
      name: `Teste ${Date.now().toString().slice(-6)}`,
      color: '#ff2d95',
      permissions: ['panel_limited'],
    })
    assertDb(error)

    const update = await supabase.from('roles').update({ color: '#b347d9' }).eq('id', id)
    assertDb(update.error)

    const remove = await supabase.from('roles').delete().eq('id', id)
    assertDb(remove.error)
  })

  const testOrder = () => runTest('Pedidos', async () => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from('orders').insert({
      id,
      customer_name: 'Cliente Teste',
      customer_email: 'cliente.teste@quantic.local',
      customer_avatar: '/avatars/default.jpg',
      status: 'em_processamento',
      total: 1,
      items: [{ product_id: 0, name: 'Item Teste', price: 1, quantity: 1 }],
    })
    assertDb(error)

    const update = await supabase.from('orders').update({ status: 'pago' }).eq('id', id)
    assertDb(update.error)

    const remove = await supabase.from('orders').delete().eq('id', id)
    assertDb(remove.error)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Logs do Sistema</h1>
        <p className="text-text-dim text-sm">Teste as funcoes principais do painel e veja o retorno do Supabase.</p>
      </div>

      <div className="review-card rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ['Produtos', testProduct],
            ['Banners', testBanner],
            ['Cupons', testCoupon],
            ['Cargos', testRole],
            ['Pedidos', testOrder],
          ].map(([label, action]) => (
            <button
              key={label as string}
              onClick={action as () => void}
              disabled={!!running}
              className="rounded-lg border border-neon-pink/20 bg-void-lighter px-4 py-3 text-left text-sm text-text-main hover:border-neon-pink/50 disabled:opacity-50"
            >
              <span className="font-heading font-bold">{label as string}</span>
              <span className="block text-xs text-text-dim mt-1">
                {running === label ? 'Testando...' : 'Criar, editar e apagar teste'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="review-card rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-neon-pink" />
          <h2 className="font-heading font-bold text-text-main">Resultados</h2>
        </div>
        {results.length === 0 ? (
          <p className="text-text-dim text-sm">Nenhum teste executado ainda.</p>
        ) : (
          results.map((result, index) => (
            <AdminFeedback
              key={`${result.name}-${index}`}
              type={result.success ? 'success' : 'error'}
              message={`${result.name}: ${result.message}`}
            />
          ))
        )}
      </div>
    </div>
  )
}
