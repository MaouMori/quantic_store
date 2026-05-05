import { useState } from 'react'
import type { ReactNode } from 'react'
import { CreditCard, History, ClipboardList, Settings, MessageSquare, FileText, FolderTree, Tag, Lock, UserCog, Plus, Trash2 } from 'lucide-react'
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Usuarios</h1>
        <p className="text-text-dim text-sm">Gerencie usuarios do painel</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <UserCog className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de usuarios em desenvolvimento.</p>
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Depoimentos</h1>
        <p className="text-text-dim text-sm">Gerencie depoimentos de clientes</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <MessageSquare className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de depoimentos em desenvolvimento.</p>
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Historico de Compras</h1>
        <p className="text-text-dim text-sm">Relatorio completo de compras</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <History className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Historico de compras em desenvolvimento.</p>
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
