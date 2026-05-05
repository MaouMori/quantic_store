import { useState } from 'react'
import { CreditCard, History, ClipboardList, Settings, MessageSquare, FileText, FolderTree, Tag, Lock, UserCog } from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'
import { AdminFeedback } from '../../components/admin/AdminFeedback'

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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Categorias</h1>
        <p className="text-text-dim text-sm">Gerencie categorias de produtos</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <FolderTree className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de categorias em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminTags() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Tags</h1>
        <p className="text-text-dim text-sm">Gerencie tags de produtos</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Tag className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de tags em desenvolvimento.</p>
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
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    addBanner,
    updateBanner,
    deleteBanner,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addRole,
    updateRole,
    deleteRole,
    addOrder,
    updateOrderStatus,
  } = useAdmin()
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

  const assertResult = (result: { success: boolean; error?: string }) => {
    if (!result.success) throw new Error(result.error || 'Operacao falhou no Supabase.')
  }

  const testProduct = () => runTest('Produtos', async () => {
    const marker = Date.now()
    const create = await addProduct({
      name: `TESTE PRODUTO ${marker}`,
      price: 1,
      image: '/hero/slide1.jpg',
      images: ['/hero/slide1.jpg'],
      category: 'outros',
      isNew: true,
      isBestseller: false,
      description: 'Produto criado pelo teste automatico do painel.',
      inGameImages: [],
      specs: [],
    })
    assertResult(create)
  })

  const testBanner = () => runTest('Banners', async () => {
    const marker = Date.now().toString()
    const create = await addBanner({
      title: `TESTE BANNER ${marker}`,
      image: '/hero/slide1.jpg',
      link: '/loja',
      position: 'loja',
      active: true,
    })
    assertResult(create)
  })

  const testCoupon = () => runTest('Cupons', async () => {
    const create = await addCoupon({
      code: `TESTE${Date.now().toString().slice(-6)}`,
      discount: 1,
      type: 'percent',
      minPurchase: 0,
      maxUses: 1,
      active: true,
    })
    assertResult(create)
  })

  const testRole = () => runTest('Cargos', async () => {
    const create = await addRole({
      name: `Teste ${Date.now().toString().slice(-6)}`,
      color: '#ff2d95',
      permissions: ['panel_limited'],
    })
    assertResult(create)
  })

  const testOrder = () => runTest('Pedidos', async () => {
    const create = await addOrder({
      customer: 'Cliente Teste',
      customerAvatar: '/avatars/default.jpg',
      date: new Date().toLocaleString('pt-BR'),
      status: 'em_processamento',
      total: 1,
      items: [{ productId: 0, name: 'Item Teste', price: 1, quantity: 1 }],
    })
    assertResult(create)
    pushResult('Pedidos', true, 'Pedido teste criado. Altere o status na aba Pedidos para validar a atualizacao.')
  })

  const testDeletesAndUpdates = () => runTest('Atualizacao e exclusao', async () => {
    const bannerId = crypto.randomUUID()
    const roleId = crypto.randomUUID()
    const couponId = crypto.randomUUID()
    await Promise.all([updateBanner(bannerId, { title: 'Teste inexistente' }), updateRole(roleId, { name: 'Teste inexistente' }), updateCoupon(couponId, { code: 'INEXISTE' })])
    await Promise.all([deleteBanner(bannerId), deleteRole(roleId), deleteCoupon(couponId), deleteProduct(-1), updateProduct(-1, { name: 'Teste inexistente' }), updateOrderStatus(crypto.randomUUID(), 'pago')])
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
            ['Atualizacao e exclusao', testDeletesAndUpdates],
          ].map(([label, action]) => (
            <button
              key={label as string}
              onClick={action as () => void}
              disabled={!!running}
              className="rounded-lg border border-neon-pink/20 bg-void-lighter px-4 py-3 text-left text-sm text-text-main hover:border-neon-pink/50 disabled:opacity-50"
            >
              <span className="font-heading font-bold">{label as string}</span>
              <span className="block text-xs text-text-dim mt-1">
                {running === label ? 'Testando...' : 'Criar teste'}
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
